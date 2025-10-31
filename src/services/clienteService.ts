import db from '../database';
import { Cliente } from '../interfaces/Cliente';

export const findOrCreateByTelefone = async (
  telefone: string,
  nomePessoa: string
): Promise<Cliente> => {
  // Remove tudo após o '@', inclusive
  const telefoneLimpo = telefone.split('@')[0];

  const [rows] = await db.query(
    'SELECT * FROM clientes WHERE telefone = ?',
    [telefoneLimpo]
  ) as [Cliente[], any];

  if (rows.length > 0) {
    return rows[0];
  }

  const [result] = await db.query(
    'INSERT INTO clientes (telefone, nome) VALUES (?, ?)',
    [telefoneLimpo, nomePessoa]
  ) as [{ insertId: number }, any];

  const [newRows] = await db.query(
    'SELECT * FROM clientes WHERE id = ?',
    [result.insertId]
  ) as [Cliente[], any];
  
  return newRows[0];
};