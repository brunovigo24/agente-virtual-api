const etapaService = require('./etapaService');
const mensagemService = require('./mensagemService');
const evolutionApiService = require('./evolutionApiService');

exports.transferirParaHumano = async (telefone, conversaId, numeroDestino) => {

  const nomesMenusPrincipais = {
    matriculas_menu: 'Matrículas',
    coordenacao_menu: 'Coordenação',
    financeiro_menu: 'Financeiro',
    documentacao_menu: 'Documentação',
    rh_menu: 'RH'
  };  

  const telefoneFormatado = telefone.replace(/@s\.whatsapp\.net$/, '');

  const etapas = await etapaService.getEtapas(conversaId);
  const mensagens = await mensagemService.getMensagens(conversaId);

  const formatarEtapa = (etapa, index) => {
    if (index === 0 && nomesMenusPrincipais[etapa]) {
      return nomesMenusPrincipais[etapa];
    }
    return etapa
      .replace(/^.*?_/, '') // remove prefixo
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };
  

  const etapasFormatadas = Object.values(etapas)
  .filter(e => e && typeof e === 'string')
  .map((e, i) => `🔹 ${i === 0 ? 'Área' : `Menu ${i}`}: ${formatarEtapa(e, i)}`)
  .join('\n');

  const entradasUsuario = mensagens
    .filter(m => m.tipo === 'entrada')
    .map(m => `🗨️ ${m.mensagem}`)
    .join('\n');

  const mensagemTransferencia =
    `🤖 *Atendimento Virtual Finalizado*

📱 *Usuário:* ${telefoneFormatado}

🧭 *Caminho percorrido:*
${etapasFormatadas}

💬 *Mensagens enviadas pelo usuário:*
${entradasUsuario}

📨 *Encaminhado para atendimento humano.*`;

  await evolutionApiService.enviarMensagem(numeroDestino, mensagemTransferencia);
};
