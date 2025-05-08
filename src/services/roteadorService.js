const fluxo = require('../utils/fluxoEtapas');
const etapasDeEncaminhamentoDireto = fluxo.etapasDeEncaminhamentoDireto;
const conversaService = require('./conversaService');
const menus = require('../utils/menus');
const actionHandlers = require('../utils/actionHandlers');
const etapaService = require('./etapaService');
const transferenciaService = require('./transferenciaService');
const destinosTransferencia = require('../utils/destinosTransferencia'); // novo arquivo com mapeamento

exports.avaliar = async (etapaAtual, mensagem, conversa, telefone) => {
  let opcoes = fluxo.rotas[etapaAtual] || fluxo[etapaAtual];

  // Busca etapa exata ou wildcard "*"
  let proximaEtapa = opcoes?.[mensagem.trim()];
  if (!proximaEtapa && opcoes?.['*']) {
    proximaEtapa = opcoes['*'];
  }

  // Executa handler, mas NÃO retorna imediatamente
  if (actionHandlers[etapaAtual]?.[mensagem]) {
    await actionHandlers[etapaAtual][mensagem](telefone);
  }

  // Se encontrou próxima etapa, atualiza conversa e registra etapa
  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);
    await etapaService.registrarEtapa(conversa.id, proximaEtapa);

    // Encaminhamento direto: se etapa está na lista, transfere já
    if (etapasDeEncaminhamentoDireto.includes(proximaEtapa)) {
      const etapas = await etapaService.getEtapas(conversa.id);
      const menuPrincipal = etapas?.etapa_1;
      const numeroDestino = destinosTransferencia[menuPrincipal] || '5544988587535';

      await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
      await transferenciaService.transferirParaHumano(telefone, conversa.id, numeroDestino);
      return { tipo: 'transferido_finalizado' };
    }

    // Se for coleta de dados, pula para a lógica abaixo
    if (proximaEtapa === 'coleta_dados') {
      etapaAtual = 'coleta_dados';
    } else {
      const menuKey = proximaEtapa.replace(/_menu$/, 'Menu');
      if (menus[proximaEtapa]) {
        return { tipo: 'menu', menu: menus[proximaEtapa] };
      }
      if (menus[menuKey]) {
        return { tipo: 'menu', menu: menus[menuKey] };
      }
    }
  }

  // Lógica de coleta e posterior transferência
  if (etapaAtual === 'coleta_dados') {
    const etapas = await etapaService.getEtapas(conversa.id);
    const menuPrincipal = etapas?.etapa_1;
    const numeroDestino = destinosTransferencia[menuPrincipal] || '5544988587535';

    await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
    await transferenciaService.transferirParaHumano(telefone, conversa.id, numeroDestino);
    return { tipo: 'transferido_finalizado' };
  }

  // Caso apenas ação foi executada, sem transição
  if (actionHandlers[etapaAtual]?.[mensagem]) {
    return { tipo: 'acao' };
  }

  return null; // Nenhuma opção válida encontrada
};
