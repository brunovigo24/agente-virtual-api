const fluxo = require('../utils/fluxoEtapas');
const mensagens = require('../utils/mensagensSistema');
const conversaService = require('./conversaService');
const menus = require('../utils/menus');


exports.avaliar = async (etapaAtual, mensagem, conversa) => {
  let opcoes = fluxo.rotas[etapaAtual] || fluxo[etapaAtual];
  const proximaEtapa = opcoes?.[mensagem.trim()];

  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);

    // Busca menu correspondente à próxima etapa, se existir
    const menuKey = proximaEtapa.replace(/_menu$/, 'Menu');
    if (menus[proximaEtapa]) {
      return menus[proximaEtapa];
    }
    if (menus[menuKey]) {
      return menus[menuKey];
    }
    return null; // Não há menu, controller envia mensagem padrão
  }

  return null; // Opção inválida, controller envia mensagem padrão
};
