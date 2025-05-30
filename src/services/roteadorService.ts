import { Conversa } from '../interfaces/Conversa';
import * as conversaService from './conversaService';
import * as etapaService from './etapaService';
import * as transferenciaService from './transferenciaService';
import { lerJson } from '../utils/jsonLoader';
import { AvaliarResultado } from '../interfaces/AvaliarResultado';
import * as evolutionApiService from './evolutionApiService';
import * as acoesService from './acoesService';
const fluxoEtapas = lerJson('fluxoEtapas.json');
const etapasDeEncaminhamentoDireto: string[] = fluxoEtapas.etapasDeEncaminhamentoDireto;
const etapasAjudoEmMaisInformacoes: string[] = fluxoEtapas.etapasAjudoEmMaisInformacoes;
const menus = lerJson('menus.json');

export const avaliar = async (
  etapaAtual: string,
  mensagem: string,
  conversa: Conversa,
  telefone: string
): Promise<AvaliarResultado | null> => {

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
    } else if (acaoDinamica.acao_tipo === 'arquivo' && acaoDinamica.arquivo && acaoDinamica.arquivo_nome && acaoDinamica.arquivo_tipo) {
      // Converter Buffer para base64
      const base64 = acaoDinamica.arquivo.toString('base64');
      // Definir mediatype dinamicamente
      let mediatype = acaoDinamica.arquivo_tipo.split('/')[0];
      if (mediatype === 'application') {
        mediatype = 'document';
      }
      await evolutionApiService.enviarArquivo(
        telefone,
        {
          mediatype: mediatype, // dinâmico conforme arquivo_tipo
          mimetype: acaoDinamica.arquivo_tipo,
          media: base64,
          fileName: acaoDinamica.arquivo_nome
        },
        {
          caption: acaoDinamica.conteudo // Usado como legenda
        }
      );
    }
    // Envia lista de "Ajudo em algo mais?"
    await evolutionApiService.enviarLista(telefone,(menus as any).ajudo_mais);
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
      // etapa_1 sempre será 'menu_principal', então usamos etapa_2 ou etapa_3 conforme o caso
      let chaveDestino: string;

      if ((etapas as any)?.etapa_2 === 'coordenacao_menu') {
        chaveDestino = String((etapas as any)?.etapa_3 || '');
      } else {
        chaveDestino = String((etapas as any)?.etapa_2 || '');
      }

      const numeroDestino = destinosTransferencia && chaveDestino && destinosTransferencia.hasOwnProperty(chaveDestino)
        ? destinosTransferencia[chaveDestino]
        : '5544988587535';

      await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
      await transferenciaService.transferirParaHumano(telefone, conversa.id.toString(), numeroDestino);
      return { tipo: 'transferido_finalizado' };
    }

    // Se for coleta de dados, pula para a lógica abaixo
    if (proximaEtapa === 'coleta_dados') {
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

  // Lógica de coleta e posterior transferência
  if (etapaAtual === 'coleta_dados') {
    const destinosTransferencia = lerJson('destinosTransferencia.json');
    const etapas = await etapaService.getEtapas(conversa.id);
    const chaveDestino = String((etapas as any)?.etapa_2 || '');
    const numeroDestino = destinosTransferencia && chaveDestino && destinosTransferencia.hasOwnProperty(chaveDestino)
      ? destinosTransferencia[chaveDestino]
      : '5544988587535';

    await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
    await transferenciaService.transferirParaHumano(telefone, conversa.id.toString(), numeroDestino);
    return { tipo: 'transferido_finalizado' };
  }

  // Caso apenas ação foi executada, sem transição
  if (acaoDinamica) {
    return { tipo: 'acao' };
  }

  return null; // Nenhuma opção válida encontrada
};
