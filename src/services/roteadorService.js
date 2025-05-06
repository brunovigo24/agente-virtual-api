const fluxo = require('../utils/fluxoEtapas');
const mensagens = require('../utils/mensagensSistema');
const conversaService = require('./conversaService');

exports.avaliar = async (etapaAtual, mensagem, conversa) => {
  let opcoes = fluxo.rotas[etapaAtual] || fluxo[etapaAtual];
  const proximaEtapa = opcoes?.[mensagem.trim()];

  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);

    // Busca mensagem do sistema pelo nome do menu, se existir
    const menuMsgKey = proximaEtapa.replace(/_menu$/, 'Menu');
    return mensagens[proximaEtapa] || mensagens[menuMsgKey] || '🔧 Em construção.';
  }

  return mensagens.opcaoInvalida; 
};
