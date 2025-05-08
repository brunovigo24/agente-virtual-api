const clienteService = require('../services/clienteService');
const conversaService = require('../services/conversaService');
const mensagemService = require('../services/mensagemService');
const roteadorService = require('../services/roteadorService');
const evolutionApiService = require('../services/evolutionApiService');
const menus = require('../utils/menus');
const mensagensSistema = require('../utils/mensagensSistema');

const STATUS = {
  MENU_ENVIADO: 'menu enviado',
  ATENDIMENTO_ENCERRADO: 'atendimento encerrado',
  IGNORADO: 'ignorado: mensagem do próprio bot',
  OK: 'ok'
};

const extrairDadosMensagem = (dados) => {
  const telefone = dados?.data?.key?.remoteJid;
  const instancia = dados?.instance;
  const nomePessoa = dados?.data?.pushName || 'Desconhecido';
  const idMensagem = dados?.data?.key?.id;
  const mensagem = dados?.data?.message?.conversation
    || dados?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId
    || '';

  return { telefone, instancia, nomePessoa, idMensagem, mensagem };
};

const logMensagemRecebida = (dados) => {
  const { telefone, instancia, nomePessoa, idMensagem, mensagem } = dados;
  console.log({
    level: 'info',
    message: 'Mensagem recebida',
    telefone,
    instancia,
    nomePessoa,
    idMensagem,
    mensagem
  });
};

const handlePrimeiraInteracao = async (cliente, mensagem, telefone, conversa) => {
  conversa = await conversaService.criar(cliente);
  await mensagemService.registrarEntrada(conversa.id, mensagem);
  await conversaService.atualizarUltimaInteracao(conversa.id);
  await evolutionApiService.enviarMensagem(telefone, mensagensSistema.boasVindas);
  await evolutionApiService.enviarLista(telefone, menus.menu_principal);
  return { status: STATUS.MENU_ENVIADO };
};

const processarMensagem = async (conversa, mensagem, telefone) => {
  if (mensagem === '0') {
    await conversaService.finalizarConversa(conversa.id);
    await evolutionApiService.enviarMensagem(telefone, mensagensSistema.usuarioEncerrouAtendimento);
    return { status: STATUS.ATENDIMENTO_ENCERRADO };
  }

  const resultadoRoteador = await roteadorService.avaliar(conversa.etapa_atual, mensagem, conversa, telefone);
  await processarResultadoRoteador(resultadoRoteador, conversa, telefone);
  
  return { status: STATUS.OK };
};

const processarResultadoRoteador = async (resultadoRoteador, conversa, telefone) => {
  switch (resultadoRoteador?.tipo) {
    case 'menu':
      await evolutionApiService.enviarLista(telefone, resultadoRoteador.menu);
      await conversaService.atualizarUltimaInteracao(conversa.id);
      break;
    case 'acao':
      await conversaService.atualizarUltimaInteracao(conversa.id);
      break;
    case 'transferido_finalizado':
      await conversaService.finalizarConversa(conversa.id);
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.atendimentoEncerrado);
      break;
    default:
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.opcaoInvalida);
      await conversaService.atualizarUltimaInteracao(conversa.id);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const dados = req.body;
    console.log('[Webhook] Dados recebidos:', JSON.stringify(dados, null, 2));

    if (dados?.data?.key?.fromMe) {
      return res.json({ status: STATUS.IGNORADO });
    }

    const dadosMensagem = extrairDadosMensagem(dados);
    logMensagemRecebida(dadosMensagem);
    
    const { telefone, nomePessoa, mensagem } = dadosMensagem;
    
    const cliente = await clienteService.findOrCreateByTelefone(telefone, nomePessoa);
    let conversa = await conversaService.getAtiva(cliente);

    const resultado = !conversa 
      ? await handlePrimeiraInteracao(cliente, mensagem, telefone, conversa)
      : await processarMensagem(conversa, mensagem, telefone);

    res.json(resultado);
  } catch (err) {
    console.error({
      level: 'error',
      message: 'Erro ao processar webhook',
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
};

