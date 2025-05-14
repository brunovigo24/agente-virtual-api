const fluxo = require('../utils/fluxoEtapas');
const etapasDeEncaminhamentoDireto = fluxo.etapasDeEncaminhamentoDireto;
const conversaService = require('./conversaService');
const menus = require('../utils/menus');
const actionHandlers = require('../utils/actionHandlers');
const etapaService = require('./etapaService');
const transferenciaService = require('./transferenciaService');
const destinosTransferencia = require('../utils/destinosTransferencia'); // novo arquivo com mapeamento

exports.avaliar = async (etapaAtual, mensagem, conversa, telefone) => {
  // Lógica de voltar etapa
  if (mensagem.trim() === '#' || mensagem.toLowerCase() === 'voltar') {
    const etapas = await etapaService.getEtapas(conversa.id);
    const caminho = Object.values(etapas).filter(e => e && typeof e === 'string');

    if (caminho.length >= 2) {
      const etapaAnterior = caminho[caminho.length - 2];

      await conversaService.atualizarEtapa(conversa.id, etapaAnterior);
      await etapaService.removerUltimaEtapa(conversa.id);

      const menuKey = etapaAnterior.replace(/_menu$/, 'Menu');
      if (menus[etapaAnterior]) {
        return { tipo: 'menu', menu: menus[etapaAnterior] };
      }
      if (menus[menuKey]) {
        return { tipo: 'menu', menu: menus[menuKey] };
      }

      return { tipo: 'etapa_atualizada' };
    }

    return { tipo: 'erro', mensagem: 'Você já está no início do atendimento.' };
  }

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
      let menuPrincipal = etapas?.etapa_1;
      let numeroDestino;

      if (menuPrincipal === 'coordenacao_menu') {
        // Se for coordenacao_menu, usa etapa_2 para o destino pois é o único que vários telefones para o mesmo menu
        // Exemplo: coordenacao_menu -> coordenacao_infantil_zona5
        const subCoordenacao = etapas?.etapa_2;
        numeroDestino = destinosTransferencia[subCoordenacao] || '5544988587535';
      } else {
        numeroDestino = destinosTransferencia[menuPrincipal] || '5544988587535';
      }

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
