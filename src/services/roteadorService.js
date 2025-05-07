const fluxo = require('../utils/fluxoEtapas');
const conversaService = require('./conversaService');
const menus = require('../utils/menus');
const actionHandlers = require('../utils/actionHandlers');
const etapaService = require('./etapaService');

exports.avaliar = async (etapaAtual, mensagem, conversa, telefone) => {
  let opcoes = fluxo.rotas[etapaAtual] || fluxo[etapaAtual];
  const proximaEtapa = opcoes?.[mensagem.trim()];

  // Executa ação se houver handler definido, mas NÃO retorna ainda
  if (actionHandlers[etapaAtual]?.[mensagem]) {
    await actionHandlers[etapaAtual][mensagem](telefone);
  }

  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);
    await etapaService.registrarEtapa(conversa.id, proximaEtapa);

    const menuKey = proximaEtapa.replace(/_menu$/, 'Menu');
    if (menus[proximaEtapa]) {
      return { tipo: 'menu', menu: menus[proximaEtapa] };
    }
    if (menus[menuKey]) {
      return { tipo: 'menu', menu: menus[menuKey] };
    }
  }

  // Caso haja handler, mas nenhuma etapa mapeada (resposta final por ex)
  if (actionHandlers[etapaAtual]?.[mensagem]) {
    return { tipo: 'acao' };
  }

  return null; // Nenhuma opção válida encontrada
};
