import db from '../database';
import * as conversaService from '../services/conversaService';
import * as evolutionApiService from '../services/evolutionApiService';
import { lerJson } from '../utils/jsonLoader';
const mensagensSistema = lerJson('mensagensSistema.json');

const encerrarConversasInativas = async (): Promise<void> => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, cl.telefone
       FROM conversas c
       JOIN clientes cl ON c.id_cliente = cl.id
       WHERE c.fim_em IS NULL AND TIMESTAMPDIFF(MINUTE, c.ultima_interacao, NOW()) >= 5`
    );
    const conversas = rows as Array<{ id: number; telefone: string }>;

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

export default () => {
  setInterval(encerrarConversasInativas, 5 * 60 * 1000); // Executa a cada 5 minutos
};
