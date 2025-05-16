import db from '../database';
import { Mensagem } from '../interfaces/Mensagem';

export const registrarEntrada = async (conversaId: number, mensagem: string): Promise<void> => {
  await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, 'entrada', NOW())`,
    [conversaId, mensagem]
  );
};

export const registrarSaida = async (conversaId: number, mensagem: string): Promise<void> => {
  await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, 'saida', NOW())`,
    [conversaId, mensagem]
  );
};

export const getMensagens = async (conversaId: number): Promise<Mensagem[]> => {
  const [rows] = await db.query(
    `SELECT * FROM mensagens 
     WHERE conversa_id = ?
     ORDER BY data_hora ASC`,
    [conversaId]
  ) as [Mensagem[], any];
  return rows;
};
