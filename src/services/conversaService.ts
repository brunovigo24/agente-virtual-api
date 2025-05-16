import db from '../database';
import { Conversa } from '../interfaces/Conversa';
import { Cliente } from '../interfaces/Cliente';

// Busca conversa ativa (NÃO cria nova)
export const getAtiva = async (cliente: Cliente): Promise<Conversa | null> => {
  const [rows]: any = await db.query(
    `SELECT * FROM conversas
     WHERE id_cliente = (
       SELECT id FROM clientes WHERE telefone = ?
     ) AND fim_em IS NULL
     ORDER BY id DESC
     LIMIT 1`,
    [cliente.telefone]
  );
  if (rows.length > 0) {
    return rows[0] as Conversa;
  }
  return null;
};

// Cria nova conversa
export const criar = async (cliente: Cliente): Promise<Conversa> => {
  const [result]: any = await db.query(
    'INSERT INTO conversas (id_cliente, etapa_atual) VALUES (?, ?)',
    [cliente.id, 'menu_principal']
  );
  const [novaConversa]: any = await db.query(
    'SELECT * FROM conversas WHERE id = ?',
    [result.insertId]
  );
  return novaConversa[0] as Conversa;
};

export const atualizarEtapa = async (conversaId: number, novaEtapa: string): Promise<any> => {
  const [rows]: any = await db.query(
    'UPDATE conversas SET etapa_atual = ? WHERE id = ?',
    [novaEtapa, conversaId]
  );
  return rows;
};

export const atualizarUltimaInteracao = async (conversaId: number): Promise<void> => {
  await db.query('UPDATE conversas SET ultima_interacao = NOW() WHERE id = ?', [conversaId]);
};

export const finalizarConversa = async (conversaId: number): Promise<any> => {
  const [rows]: any = await db.query(
    'UPDATE conversas SET fim_em = NOW() WHERE id = ?',
    [conversaId]
  );
  return rows;
};
