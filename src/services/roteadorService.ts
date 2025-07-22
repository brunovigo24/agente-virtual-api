import { Conversa } from '../interfaces/Conversa';
import * as conversaService from './conversaService';
import * as etapaService from './etapaService';
import * as transferenciaService from './transferenciaService';
import { lerJson } from '../utils/jsonLoader';
import { AvaliarResultado } from '../interfaces/AvaliarResultado';
import * as evolutionApiService from './evolutionApiService';
import * as acoesService from './acoesService';

export const avaliar = async (
  etapaAtual: string,
  mensagem: string,
  conversa: Conversa,
  telefone: string
): Promise<AvaliarResultado | null> => {

  // Carregar dados do JSON a cada execução para evitar problemas de cache
  const fluxoEtapas = lerJson('fluxoEtapas.json');
  const etapasDeEncaminhamentoDireto: string[] = fluxoEtapas.etapasDeEncaminhamentoDireto;
  const etapasAjudoEmMaisInformacoes: string[] = fluxoEtapas.etapasAjudoEmMaisInformacoes;
  const menus = lerJson('menus.json');
  const destinosTransferencia = lerJson('destinosTransferencia.json');

  // Lógica para quando está aguardando resposta de uma ação
  if (etapaAtual === 'aguardando_resposta_acao') {
    // Coleta a resposta e direciona para coleta_dados para transferência
    await conversaService.atualizarEtapa(conversa.id, 'coleta_dados');
    // A lógica de coleta_dados já existe mais abaixo no código
    etapaAtual = 'coleta_dados';
  }

  // Lógica para resposta da lista "Ajudo em algo mais?"
  if (etapasAjudoEmMaisInformacoes?.includes(etapaAtual)) {
    if (mensagem.trim() === '1') {
      await etapaService.resetar(conversa.id);
      await conversaService.atualizarEtapa(conversa.id, 'menu_principal');
      const menus = lerJson('menus.json');
      return { tipo: 'menu', menu: (menus as any)['menu_principal'] };
    }
    if (mensagem.trim() === '2') {
      return { tipo: 'finalizado' };
    }
  }

  // Lógica de voltar etapa
  if (mensagem.trim() === '#' || mensagem.toLowerCase() === 'voltar') {
    const etapas = await etapaService.getEtapas(conversa.id);
    const caminho = Object.values(etapas || {}).filter(e => e && typeof e === 'string');

    if (caminho.length >= 2) {
      const etapaAnterior = caminho[caminho.length - 2];

      await conversaService.atualizarEtapa(conversa.id, etapaAnterior);
      await etapaService.removerUltimaEtapa(conversa.id);

      const menuKey = (etapaAnterior as string).replace(/_menu$/, 'Menu');
      const menus = lerJson('menus.json');

      if ((menus as any)[etapaAnterior]) {
        return { tipo: 'menu', menu: (menus as any)[etapaAnterior] };
      }
      if ((menus as any)[menuKey]) {
        return { tipo: 'menu', menu: (menus as any)[menuKey] };
      }

      return { tipo: 'etapa_atualizada' };
    }

    return { tipo: 'erro', mensagem: 'Você já está no início do atendimento.' };
  }

  let opcoes = (fluxoEtapas.rotas as any)[etapaAtual] || (fluxoEtapas as any)[etapaAtual];

  // Busca etapa exata ou wildcard "*"
  let proximaEtapa = opcoes?.[mensagem.trim()];
  if (!proximaEtapa && opcoes?.['*']) {
    proximaEtapa = opcoes['*'];
  }

  const acaoDinamica = await acoesService.buscarPorEtapaEOpcoes(etapaAtual, mensagem.trim());
  if (acaoDinamica) {
    if (acaoDinamica.acao_tipo === 'mensagem') {
      await evolutionApiService.enviarMensagem(telefone, acaoDinamica.conteudo);
    } else if (acaoDinamica.acao_tipo === 'link') {
      await evolutionApiService.enviarMensagem(telefone, `🔗 ${acaoDinamica.conteudo}`);
    } else if (acaoDinamica.acao_tipo === 'arquivo' && acaoDinamica.arquivos && acaoDinamica.arquivos.length > 0) {
      // Processar múltiplos arquivos
      for (let i = 0; i < acaoDinamica.arquivos.length; i++) {
        const arquivo = acaoDinamica.arquivos[i];
        
        // Converter Buffer para base64
        const base64 = arquivo.arquivo.toString('base64');
        // Definir mediatype dinamicamente
        let mediatype = arquivo.arquivo_tipo.split('/')[0];
        if (mediatype === 'application') {
          mediatype = 'document';
        }
        
        // Criar legenda com numeração se houver múltiplos arquivos
        let caption = acaoDinamica.conteudo;
        if (acaoDinamica.arquivos.length > 1) {
          caption = `${acaoDinamica.conteudo} (${i + 1}/${acaoDinamica.arquivos.length})`;
        }
        
        await evolutionApiService.enviarArquivo(
          telefone,
          {
            mediatype: mediatype, // dinâmico conforme arquivo_tipo
            mimetype: arquivo.arquivo_tipo,
            media: base64,
            fileName: arquivo.arquivo_nome
          },
          {
            caption: caption,
            delay: i === 0 ? 1000 : 2000 
          }
        );
        
        // Pequeno delay entre arquivos para evitar rate limiting
        if (i < acaoDinamica.arquivos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Verifica se deve aguardar resposta ou enviar menu "ajudo em algo mais"
    if (acaoDinamica.aguarda_resposta) {
      // Atualiza etapa para aguardar resposta
      await conversaService.atualizarEtapa(conversa.id, 'aguardando_resposta_acao');
      return { tipo: 'aguardando_resposta' };
    } else {
      // Comportamento padrão: envia lista de "Ajudo em algo mais?"
      await evolutionApiService.enviarLista(telefone,(menus as any).ajudo_mais);
    }
  }

  // Se encontrou próxima etapa, atualiza conversa e registra etapa
  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);
    await etapaService.registrarEtapa(conversa.id, proximaEtapa);

    const destinosTransferencia = lerJson('destinosTransferencia.json');

    console.log('destinosTransferencia:', destinosTransferencia);
    // Encaminhamento direto: se etapa está na lista, transfere já
    if (etapasDeEncaminhamentoDireto.includes(proximaEtapa)) {
      const etapas = await etapaService.getEtapas(conversa.id);
      // Lógica para determinar a chave de destino
      let chaveDestino: string;
      if ((etapas as any)?.etapa_2 === 'coordenacao_menu') {
        // Coordenação tem 5 opções, então usa etapa_3 (submenu específico)
        chaveDestino = String((etapas as any)?.etapa_3 || '');
      } else {
        // Para todos os outros menus, usa etapa_2 (menu principal)
        chaveDestino = String((etapas as any)?.etapa_2 || '');
      }

      const numeroDestino = destinosTransferencia && chaveDestino && destinosTransferencia.hasOwnProperty(chaveDestino)
        ? destinosTransferencia[chaveDestino]
        : null;

      if (numeroDestino) {
        await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
        await transferenciaService.transferirParaHumano(telefone, conversa.id.toString(), numeroDestino);
        return { tipo: 'transferido_finalizado' };
      } else {
        console.log('Destino de transferência não encontrado para:', chaveDestino);
        return { tipo: 'erro', mensagem: 'Destino de transferência não configurado.' };
      }
    }

    // Se for coleta de dados, pula para a lógica abaixo
    if (proximaEtapa === 'coleta_dados') {
      etapaAtual = 'coleta_dados';
    } else {
      // Verificar se a próxima etapa tem opções que levam para coleta_dados
      const proximaEtapaOpcoes = (fluxoEtapas as any)[proximaEtapa];
      if (proximaEtapaOpcoes && proximaEtapaOpcoes['*'] === 'coleta_dados') {
        console.log('Debug - Próxima etapa tem wildcard para coleta_dados, processando...');
        // Processar qualquer mensagem como coleta_dados
        etapaAtual = 'coleta_dados';
      } else {
        const menuKey = (proximaEtapa as string).replace(/_menu$/, 'Menu');
        const menus = lerJson('menus.json');

        if ((menus as any)[proximaEtapa]) {
          return { tipo: 'menu', menu: (menus as any)[proximaEtapa] };
        }
        if ((menus as any)[menuKey]) {
          return { tipo: 'menu', menu: (menus as any)[menuKey] };
        }
      }
    }
  }

  // Lógica de coleta e posterior transferência
  if (etapaAtual === 'coleta_dados') {
    const destinosTransferencia = lerJson('destinosTransferencia.json');
    const etapas = await etapaService.getEtapas(conversa.id);
    
    // Lógica para determinar a chave de destino
    let chaveDestino: string;
    if ((etapas as any)?.etapa_2 === 'coordenacao_menu') {
      // Coordenação tem 5 opções, então usa etapa_3 (submenu específico)
      chaveDestino = String((etapas as any)?.etapa_3 || '');
    } else {
      // Para todos os outros menus, usa etapa_2 (menu principal)
      chaveDestino = String((etapas as any)?.etapa_2 || '');
    }
    
    const numeroDestino = destinosTransferencia && chaveDestino && destinosTransferencia.hasOwnProperty(chaveDestino)
      ? destinosTransferencia[chaveDestino]
      : null;


    if (numeroDestino) {
      await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
      await transferenciaService.transferirParaHumano(telefone, conversa.id.toString(), numeroDestino);
      return { tipo: 'transferido_finalizado' };
    } else {
      console.log('Destino de transferência não encontrado para:', chaveDestino);
      return { tipo: 'erro', mensagem: 'Destino de transferência não configurado.' };
    }
  }

  // Caso apenas ação foi executada, sem transição
  if (acaoDinamica) {
    return { tipo: 'acao' };
  }

  return null; // Nenhuma opção válida encontrada
};
