import { Conversa } from '../interfaces/Conversa';
import { fluxoEtapas } from '../utils/fluxoEtapas';
const etapasDeEncaminhamentoDireto: string[] = fluxoEtapas.etapasDeEncaminhamentoDireto;
import * as conversaService from './conversaService';
import * as etapaService from './etapaService';
import * as menus from '../utils/menus';
import * as actionHandlers from '../utils/actionHandlers';
import * as transferenciaService from './transferenciaService';
import * as destinosTransferencia from '../utils/destinosTransferencia';

interface AvaliarResultado {
  tipo: 'menu' | 'acao' | 'transferido_finalizado' | 'etapa_atualizada' | 'erro';
  menu?: any;
  mensagem?: string;
}

export const avaliar = async (
  etapaAtual: string,
  mensagem: string,
  conversa: Conversa,
  telefone: string
): Promise<AvaliarResultado | null> => {
  // Lógica de voltar etapa
  if (mensagem.trim() === '#' || mensagem.toLowerCase() === 'voltar') {
    const etapas = await etapaService.getEtapas(conversa.id);
    const caminho = Object.values(etapas || {}).filter(e => e && typeof e === 'string');

    if (caminho.length >= 2) {
      const etapaAnterior = caminho[caminho.length - 2];

      await conversaService.atualizarEtapa(conversa.id, etapaAnterior);
      await etapaService.removerUltimaEtapa(conversa.id);

      const menuKey = (etapaAnterior as string).replace(/_menu$/, 'Menu');
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

  // Executa handler, mas NÃO retorna imediatamente
  if ((actionHandlers as any)[etapaAtual]?.[mensagem]) {
    await (actionHandlers as any)[etapaAtual][mensagem](telefone);
  }

  // Se encontrou próxima etapa, atualiza conversa e registra etapa
  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);
    await etapaService.registrarEtapa(conversa.id, proximaEtapa);

    // Encaminhamento direto: se etapa está na lista, transfere já
    if (etapasDeEncaminhamentoDireto.includes(proximaEtapa)) {
      const etapas = await etapaService.getEtapas(conversa.id);
      let menuPrincipal = (etapas as any)?.etapa_1;
      let numeroDestino: string;

      if (menuPrincipal === 'coordenacao_menu') {
        // Se for coordenacao_menu, usa etapa_2 para o destino pois é o único que vários telefones para o mesmo menu
        // Exemplo: coordenacao_menu -> coordenacao_infantil_zona5
        const subCoordenacao = (etapas as any)?.etapa_2;
        numeroDestino = (destinosTransferencia as any)[subCoordenacao] || '5544988587535';
      } else {
        numeroDestino = (destinosTransferencia as any)[menuPrincipal] || '5544988587535';
      }

      await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
      await transferenciaService.transferirParaHumano(telefone, conversa.id.toString(), numeroDestino);
      return { tipo: 'transferido_finalizado' };
    }

    // Se for coleta de dados, pula para a lógica abaixo
    if (proximaEtapa === 'coleta_dados') {
      etapaAtual = 'coleta_dados';
    } else {
      const menuKey = (proximaEtapa as string).replace(/_menu$/, 'Menu');
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
    const etapas = await etapaService.getEtapas(conversa.id);
    const menuPrincipal = (etapas as any)?.etapa_1;
    const numeroDestino = (destinosTransferencia as any)[menuPrincipal] || '5544988587535';

    await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
    await transferenciaService.transferirParaHumano(telefone, conversa.id.toString(), numeroDestino);
    return { tipo: 'transferido_finalizado' };
  }

  // Caso apenas ação foi executada, sem transição
  if ((actionHandlers as any)[etapaAtual]?.[mensagem]) {
    return { tipo: 'acao' };
  }

  return null; // Nenhuma opção válida encontrada
};
