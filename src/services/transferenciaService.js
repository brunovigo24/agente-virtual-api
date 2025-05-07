const etapaService = require('./etapaService');
const mensagemService = require('./mensagemService');
const evolutionApiService = require('./evolutionApiService');

exports.transferirParaHumano = async (telefone, conversaId, numeroDestino) => {
  // Remove o sufixo '@s.whatsapp.net' se existir
  const telefoneFormatado = telefone.replace(/@s\.whatsapp\.net$/, '');

  const etapas = await etapaService.getEtapas(conversaId);
  const mensagens = await mensagemService.getMensagens(conversaId);

  const entradasUsuario = mensagens
    .filter(m => m.tipo === 'entrada')
    .map(m => `🗨️ ${m.mensagem}`)
    .join('\n');

  const etapasFormatadas = Object.values(etapas)
    .filter(e => e && typeof e === 'string')
    .map((e, i) => `🔹 Etapa ${i + 1}: ${e}`)
    .join('\n');

  const mensagemTransferencia = 
`📥 *Nova solicitação transferida do atendente virtual*

📱 Usuário: ${telefoneFormatado}

${etapasFormatadas}

✉️ Mensagens do usuário:
${entradasUsuario}

📥 *Nova solicitação transferida do atendente virtual*`;

  await evolutionApiService.enviarMensagem(numeroDestino, mensagemTransferencia);
};
