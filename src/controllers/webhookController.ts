import { Request, Response } from 'express';
import * as clienteService from '../services/clienteService';
import * as conversaService from '../services/conversaService';
import * as mensagemService from '../services/mensagemService';
import * as roteadorService from '../services/roteadorService';
import * as evolutionApiService from '../services/evolutionApiService';
import { lerJson } from '../utils/jsonLoader';
import { WebhookDados } from '../interfaces/WebhookDados';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const dados: WebhookDados = req.body;
    console.log('[Webhook] Dados recebidos:', JSON.stringify(dados, null, 2));

    // Filtro para evitar loop: ignore mensagens enviadas pelo próprio bot
    if (dados?.data?.key?.fromMe) {
     return res.json({ status: 'ignorado: mensagem do próprio bot' });
    }

    const telefone = dados?.data?.key?.remoteJid;
    const instancia = dados?.instance;
    const nomePessoa = dados?.data?.pushName || 'Desconhecido';
    const idMensagem = dados?.data?.key?.id;
    // Extrai mensagem normal ou rowId de resposta de lista
    const mensagem =
      dados?.data?.message?.conversation ||
      dados?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      '';

    console.log(`[Webhook] Número: ${telefone} | Instância: ${instancia} | Nome: ${nomePessoa} | ID Msg: ${idMensagem} | Mensagem: ${mensagem}`);

    if (!telefone) {
      return res.status(400).json({ error: 'Telefone não informado' });
    }

    // Filtro para homologação: apenas processa mensagens do número de teste
    const numeroTeste = '554488587535@s.whatsapp.net'; // ou apenas '44998667555' dependendo do formato
    if (telefone !== numeroTeste && !telefone.includes('554488587535')) {
      console.log(`[Webhook] Mensagem ignorada - número não autorizado: ${telefone}`);
      return res.json({ status: 'ignorado: número não autorizado para homologação' });
    }

    const cliente = await clienteService.findOrCreateByTelefone(telefone, nomePessoa);
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
      await mensagemService.registrarEntrada(conversa.id, mensagem);
      await conversaService.atualizarUltimaInteracao(conversa.id);
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.boasVindas);
      await evolutionApiService.enviarLista(telefone, (menus as any).menu_principal);
      return res.json({ status: 'menu enviado' });
    } else {
      await mensagemService.registrarEntrada(conversa.id, mensagem);

      if (mensagem === '0') {
        await conversaService.finalizarConversa(conversa.id);
        await evolutionApiService.enviarMensagem(telefone, mensagensSistema.usuarioEncerrouAtendimento);
        return res.json({ status: 'atendimento encerrado' });
      }

      const resultadoRoteador = await roteadorService.avaliar(conversa.etapa_atual, mensagem, conversa, telefone);
      if (resultadoRoteador?.tipo === 'menu') {
        await evolutionApiService.enviarLista(telefone, resultadoRoteador.menu);
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else if (resultadoRoteador?.tipo === 'acao') {
        await conversaService.atualizarUltimaInteracao(conversa.id);
        // ação já executada pelo roteador
      } else if (resultadoRoteador?.tipo === 'aguardando_resposta') {
        await conversaService.atualizarUltimaInteracao(conversa.id);
        // ação executada e aguardando resposta do usuário
      } else if (resultadoRoteador?.tipo === 'transferido_finalizado') {
        await conversaService.finalizarConversa(conversa.id);
        await evolutionApiService.enviarMensagem(telefone, mensagensSistema.atendimentoEncerrado);
      } else if (resultadoRoteador?.tipo === 'finalizado') {
        await conversaService.finalizarConversa(conversa.id);
        await evolutionApiService.enviarMensagem(telefone, mensagensSistema.usuarioEncerrouAtendimento);
      } else if (resultadoRoteador?.tipo === 'etapa_atualizada') {
        // Apenas atualiza a interação, sem enviar menu (caso queira, pode enviar mensagem personalizada)
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else if (resultadoRoteador?.tipo === 'erro') {
        await evolutionApiService.enviarMensagem(telefone, resultadoRoteador.mensagem || mensagensSistema.opcaoInvalida);
        await conversaService.atualizarUltimaInteracao(conversa.id);
      } else {
        await evolutionApiService.enviarMensagem(telefone, mensagensSistema.opcaoInvalida);
        await conversaService.atualizarUltimaInteracao(conversa.id);
      }
    }

    return res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('[Webhook] Erro:', err);
    return res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
};
