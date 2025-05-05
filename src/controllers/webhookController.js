const clienteService = require('../services/clienteService');
const conversaService = require('../services/conversaService');
const mensagemService = require('../services/mensagemService');
const roteadorService = require('../services/roteadorService');
const evolutionApiService = require('../services/evolutionApiService');
const menus = require('../utils/menus');

exports.handleWebhook = async (req, res) => {
  try {
    const dados = req.body;
    console.log('[Webhook] Dados recebidos:', JSON.stringify(dados, null, 2));

    // Filtro para evitar loop: ignore mensagens enviadas pelo próprio bot
    if (dados?.data?.key?.fromMe) {
      return res.json({ status: 'ignorado: mensagem do próprio bot' });
    }

    const telefone = dados?.data?.key?.remoteJid;
    const instancia = dados?.instance;
    const nomePessoa = dados?.data?.pushName || 'Desconhecido';
    const idMensagem = dados?.data?.key?.id;
    const mensagem = dados?.data?.message?.conversation || '';

    console.log(`[Webhook] Número: ${telefone} | Instância: ${instancia} | Nome: ${nomePessoa} | ID Msg: ${idMensagem} | Mensagem: ${mensagem}`);

    const cliente = await clienteService.findOrCreateByTelefone(telefone, nomePessoa);
    const conversa = await conversaService.getOrCreateAtiva(cliente);

    const primeiraInteracao = !conversa; // true se não houver conversa ativa

    await mensagemService.registrarEntrada(conversa, mensagem); // fazer

    if (primeiraInteracao) {
      await evolutionApiService.enviarMensagem(telefone, 'Olá, seja bem-vindo à nossa escola! 😊');
      await evolutionApiService.enviarMenuLista(
        telefone,
        menus.menuPrincipal.titulo,
        menus.menuPrincipal.descricao,
        menus.menuPrincipal.opcoes
      );
      return res.json({ status: 'menu enviado' });
    } else {
      const resposta = await roteadorService.avaliar(conversa.etapa_atual, mensagem, conversa);
      await evolutionApiService.enviarMensagem(telefone, resposta || 'Recebido!');
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('[Webhook] Erro:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
};

