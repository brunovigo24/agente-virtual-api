const db = require('../database');
const conversaService = require('../services/conversaService');
const evolutionApiService = require('../services/evolutionApiService');
const mensagensSistema = require('../utils/mensagensSistema');


const encerrarConversasInativas = async () => {
  try {
    const [conversas] = await db.query(
      `SELECT c.id, cl.telefone
       FROM conversas c
       JOIN clientes cl ON c.id_cliente = cl.id
       WHERE c.fim_em IS NULL AND TIMESTAMPDIFF(MINUTE, c.ultima_interacao, NOW()) >= 5`
    );

    for (const { id, telefone } of conversas) {
      await conversaService.finalizarConversa(id);
      await evolutionApiService.enviarMensagem(
        telefone,
        mensagensSistema.atendimentoEncerradoInatividade
      );
      console.log(`[Inatividade] Conversa ${id} encerrada e notificada.`);
    }
  } catch (err) {
    console.error('[Inatividade] Erro ao encerrar conversas:', err);
  }
};

module.exports = () => {
  setInterval(encerrarConversasInativas, 5 * 60 * 1000); // Executa a cada 5 minutos
};
