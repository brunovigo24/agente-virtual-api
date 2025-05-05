const clienteService = require('../services/clienteService');
const conversaService = require('../services/conversaService');
const etapaService = require('../services/etapaService');
const mensagemService = require('../services/mensagemService');
const roteadorService = require('../services/roteadorService');
const evolutionApiService = require('../services/evolutionApiService');

exports.handleWebhook = async (req, res) => {
  try {
    const dados = req.body;
    console.log('Dados recebidos:', JSON.stringify(dados, null, 2));

    const numero = dados?.data?.key?.remoteJid;
    const instancia = dados?.instance;
    const nomePessoa = dados?.data?.pushName || 'Desconhecido';
    const idMensagem = dados?.data?.key?.id;
    const mensagem = dados?.data?.message?.conversation || '';

    console.log('Número:', numero);
    console.log('Instância:', instancia);
    console.log('Nome:', nomePessoa);
    console.log('ID da Mensagem:', idMensagem);
    console.log('Mensagem:', mensagem);

    const cliente = await clienteService.findOrCreateByTelefone(numero, nomePessoa);
    const conversa = await conversaService.getOrCreateAtiva(cliente);
    const etapa = await etapaService.getAtual(conversa);

    await mensagemService.registrarEntrada(conversa, mensagem);
    const resposta = await roteadorService.avaliar(etapa, mensagem, conversa);

    await evolutionApiService.enviarMensagem(numero, resposta);

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Erro no webhook:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
};

