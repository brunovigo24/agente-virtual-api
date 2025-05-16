import db from '../database';
import { Etapa } from '../interfaces/Etapa';
import { RowDataPacket } from 'mysql2';

export const criar = async (conversaId: number): Promise<number> => {
  const [result]: any = await db.query(
    'INSERT INTO etapas (conversa_id, etapa_1) VALUES (?, ?)',
    [conversaId, 'menu_principal']
  );
  return result.insertId;
};

export const registrarEtapa = async (conversaId: number, novaEtapa: string): Promise<void> => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM etapas WHERE conversa_id = ?',
    [conversaId]
  );

  const etapas = rows as Etapa[];

  if (etapas.length === 0) {
    await criar(conversaId);
    await db.query('UPDATE etapas SET etapa_2 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
    return;
  }

  const etapaAtual = etapas[0];
  if (!etapaAtual.etapa_2) {
    await db.query('UPDATE etapas SET etapa_2 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else if (!etapaAtual.etapa_3) {
    await db.query('UPDATE etapas SET etapa_3 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else if (!etapaAtual.etapa_4) {
    await db.query('UPDATE etapas SET etapa_4 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else if (!etapaAtual.etapa_5) {
    await db.query('UPDATE etapas SET etapa_5 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else {
    console.warn(`Todas as etapas já preenchidas para a conversa ${conversaId}`);
  }
};

export const getEtapas = async (conversaId: number): Promise<Etapa | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM etapas WHERE conversa_id = ?',
    [conversaId]
  );
  const etapas = rows as Etapa[];
  return etapas[0] || null;
};

export const resetar = async (conversaId: number): Promise<any> => {
  const [rows]: any = await db.query(
    `UPDATE etapas
     SET etapa_1 = NULL, etapa_2 = NULL, etapa_3 = NULL, etapa_4 = NULL
     WHERE conversa_id = ?`,
    [conversaId]
  );
  return rows;
};

export const removerUltimaEtapa = async (conversaId: number): Promise<void> => {
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM etapas WHERE conversa_id = ?', [conversaId]);
  const etapas = rows as Etapa[];

  if (!etapas[0]) return;

  const colunas = ['etapa_5', 'etapa_4', 'etapa_3', 'etapa_2', 'etapa_1'] as const;

  for (let coluna of colunas) {
    if ((etapas[0] as any)[coluna]) {
      await db.query(`UPDATE etapas SET ${coluna} = NULL WHERE conversa_id = ?`, [conversaId]);
      break;
    }
  }
};
