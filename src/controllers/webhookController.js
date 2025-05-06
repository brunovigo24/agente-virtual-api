const clienteService = require('../services/clienteService');
const conversaService = require('../services/conversaService');
const mensagemService = require('../services/mensagemService');
const roteadorService = require('../services/roteadorService');
const evolutionApiService = require('../services/evolutionApiService');
const menus = require('../utils/menus');
const mensagensSistema = require('../utils/mensagensSistema'); 

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
    // Extrai mensagem normal ou rowId de resposta de lista
    const mensagem = dados?.data?.message?.conversation 
      || dados?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId 
      || '';

    console.log(`[Webhook] Número: ${telefone} | Instância: ${instancia} | Nome: ${nomePessoa} | ID Msg: ${idMensagem} | Mensagem: ${mensagem}`);

    const cliente = await clienteService.findOrCreateByTelefone(telefone, nomePessoa);
    let conversa = await conversaService.getAtiva(cliente); 

    const primeiraInteracao = !conversa; 

    if (primeiraInteracao) {
      // Cria nova conversa
      conversa = await conversaService.criar(cliente);
      await mensagemService.registrarEntrada(conversa, mensagem);
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.boasVindas); 
      await evolutionApiService.enviarLista(telefone, menus.menu_principal);
      //await evolutionApiService.enviarMensagem(telefone, mensagensSistema.menuPrincipal); 
      return res.json({ status: 'menu enviado' });
    } else {
      await mensagemService.registrarEntrada(conversa, mensagem);
      const proximoMenu = await roteadorService.avaliar(conversa.etapa_atual, mensagem, conversa);
      if (proximoMenu) {
        await evolutionApiService.enviarLista(telefone, proximoMenu);
      } else {
        await evolutionApiService.enviarMensagem(telefone, 'Recebido!');
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('[Webhook] Erro:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
};

