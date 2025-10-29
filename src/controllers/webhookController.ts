import { Request, Response } from 'express';
import * as clienteService from '../services/clienteService';
import * as conversaService from '../services/conversaService';
import * as mensagemService from '../services/mensagemService';
import * as roteadorService from '../services/roteadorService';
import * as evolutionApiService from '../services/evolutionApiService';
import * as evolutionDownloadService from '../services/evolutionDownloadService';
import { lerJson } from '../utils/jsonLoader';
import { WebhookDados } from '../interfaces/WebhookDados';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const dados: WebhookDados = req.body;
    console.log('[Webhook] Dados recebidos:', JSON.stringify(dados, null, 2));

    // Filtro para evitar loop: ignore mensagens enviadas pelo próprio bot
    if (dados?.data?.key?.fromMe) {
      console.log('[Webhook] Mensagem ignorada - fromMe = true');
      return res.json({ status: 'ignorado: mensagem do próprio bot' });
    }

    const telefone = dados?.data?.key?.remoteJid;
    const remoteJidAlt = (dados as any)?.data?.key?.remoteJidAlt as string | undefined;
    const telefoneEnvio = (telefone && telefone.endsWith('@lid') && remoteJidAlt)
      ? remoteJidAlt
      : telefone;
    const instancia = dados?.instance;
    const nomePessoa = dados?.data?.pushName || 'Desconhecido';
    const idMensagem = dados?.data?.key?.id;

    console.log('[Webhook] ===== DADOS EXTRAÍDOS =====');
    console.log('[Webhook] Telefone (remoteJid):', telefone);
    if (telefone && telefone.endsWith('@lid')) {
      console.log('[Webhook] Detected @lid. remoteJidAlt:', remoteJidAlt || 'N/A');
      console.log('[Webhook] Telefone de envio (após regra @lid -> alt se houver):', telefoneEnvio);
    }
    console.log('[Webhook] Instância:', instancia);
    console.log('[Webhook] Nome da pessoa:', nomePessoa);
    console.log('[Webhook] ID da mensagem:', idMensagem);
    
    // Extrai mensagem normal ou rowId de resposta de lista
    const mensagem =
      dados?.data?.message?.conversation ||
      dados?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      '';

    console.log('[Webhook] ===== MENSAGEM EXTRAÍDA =====');
    console.log('[Webhook] Mensagem:', mensagem);
    console.log('[Webhook] Tipo da mensagem:', dados?.data?.message ? (dados?.data as any).messageType || (dados?.data?.message?.listResponseMessage ? 'listMessage' : 'conversation') : 'desconhecido');

    // Verifica se há arquivo na mensagem
    let arquivoInfo = null;
    let arquivoProcessado = null;
    
    arquivoInfo = evolutionDownloadService.extrairArquivoDoWebhook(dados);
    
    if (arquivoInfo) {
      try {
        arquivoProcessado = await evolutionDownloadService.baixarArquivo(arquivoInfo);
      } catch (error) {
        console.error('[Webhook] Erro ao baixar arquivo:', error);
      }
    }

    if (!telefone) {
      return res.status(400).json({ error: 'Telefone não informado' });
    }

    console.log('[Webhook] ===== VALIDAÇÃO DO TELEFONE =====');
    console.log('[Webhook] Telefone recebido:', telefone);
    console.log('[Webhook] Tamanho do telefone:', String(telefone).length);
    console.log('[Webhook] Contém @:', String(telefone).includes('@'));
    console.log('[Webhook] Sufixo:', String(telefone).includes('@') ? String(telefone).split('@')[1] : '');

    // Filtro para homologação: apenas processa mensagens do número de teste
    // const numeroTeste = process.env.WHATSAPP_TEST_NUMBER || '';
    // if (telefone !== `${numeroTeste}@s.whatsapp.net` && !telefone.includes(numeroTeste)) {
    //   console.log(`[Webhook] Mensagem ignorada - número não autorizado: ${telefone}`);
    //   return res.json({ status: 'ignorado: número não autorizado para homologação' });
    // }

    console.log('[Webhook] ===== PROCESSAMENTO DO CLIENTE =====');
    console.log('[Webhook] Chamando findOrCreateByTelefone com:', { telefone: telefoneEnvio, nomePessoa });
    const cliente = await clienteService.findOrCreateByTelefone(telefoneEnvio!, nomePessoa);
    let conversa: import('../interfaces/Conversa').Conversa | null = await conversaService.getAtiva(cliente);

    const primeiraInteracao = !conversa;

    if (primeiraInteracao) {
      conversa = await conversaService.criar(cliente);
    }

    if (!conversa) {
      return res.status(500).json({ error: 'Falha ao criar ou recuperar conversa' });
    }

    const mensagensSistema = lerJson('mensagensSistema.json');
    const menus = lerJson('menus.json');
    
    if (primeiraInteracao) {
      await mensagemService.registrarEntrada(conversa.id, mensagem, arquivoProcessado || undefined);
      await conversaService.atualizarUltimaInteracao(conversa.id);
      await evolutionApiService.enviarMensagem(telefoneEnvio!, mensagensSistema.boasVindas);
      await evolutionApiService.enviarLista(telefoneEnvio!, (menus as any).menu_principal);
      return res.json({ status: 'menu enviado' });
    } else {
      await mensagemService.registrarEntrada(conversa.id, mensagem, arquivoProcessado || undefined);

      if (mensagem === '0') {
        await conversaService.finalizarConversa(conversa.id);
        await evolutionApiService.enviarMensagem(telefoneEnvio!, mensagensSistema.usuarioEncerrouAtendimento);
        return res.json({ status: 'atendimento encerrado' });
      }

      const resultadoRoteador = await roteadorService.avaliar(conversa.etapa_atual, mensagem, conversa, telefoneEnvio!);
      if (resultadoRoteador?.tipo === 'menu') {
        await evolutionApiService.enviarLista(telefoneEnvio!, resultadoRoteador.menu);
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else if (resultadoRoteador?.tipo === 'acao') {
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else if (resultadoRoteador?.tipo === 'aguardando_resposta') {
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else if (resultadoRoteador?.tipo === 'transferido_finalizado') {
        await conversaService.finalizarConversa(conversa.id);
        await evolutionApiService.enviarMensagem(telefoneEnvio!, mensagensSistema.atendimentoEncerrado);
      } else if (resultadoRoteador?.tipo === 'finalizado') {
        await conversaService.finalizarConversa(conversa.id);
        await evolutionApiService.enviarMensagem(telefoneEnvio!, mensagensSistema.usuarioEncerrouAtendimento);
      } else if (resultadoRoteador?.tipo === 'etapa_atualizada') {
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else if (resultadoRoteador?.tipo === 'erro') {
        await evolutionApiService.enviarMensagem(telefoneEnvio!, resultadoRoteador.mensagem || mensagensSistema.opcaoInvalida);
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else {
        await evolutionApiService.enviarMensagem(telefoneEnvio!, mensagensSistema.opcaoInvalida);
        await conversaService.atualizarUltimaInteracao(conversa.id);
      }
    }

    return res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('[Webhook] Erro:', err);
    return res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
};
