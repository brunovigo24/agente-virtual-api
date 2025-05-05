const fluxo = require('../utils/fluxoEtapas');
const mensagens = require('../utils/mensagensSistema');
const conversaService = require('./conversaService');

exports.avaliar = async (etapaAtual, mensagem, conversa) => {
  const opcoes = fluxo.rotas[etapaAtual];
  const proximaEtapa = opcoes?.[mensagem.trim()];

  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);
    return mensagens[proximaEtapa] || '🔧 Em construção.';
  }

  return mensagens.opcaoInvalida; 
};
