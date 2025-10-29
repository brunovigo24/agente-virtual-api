import db from '../database';
import { Cliente } from '../interfaces/Cliente';

export const findOrCreateByTelefone = async (
  telefone: string,
  nomePessoa: string
): Promise<Cliente> => {
  console.log('[ClienteService] ===== INÍCIO DO PROCESSAMENTO =====');
  console.log('[ClienteService] Telefone recebido:', telefone);
  console.log('[ClienteService] Nome da pessoa:', nomePessoa);
  // Remove tudo após o '@', inclusive
  const telefoneLimpo = telefone.split('@')[0];
  console.log('[ClienteService] Telefone limpo (após split @):', telefoneLimpo);
  console.log('[ClienteService] Tamanho do telefone limpo:', telefoneLimpo?.length || 0);

  const [rows] = await db.query(
    'SELECT * FROM clientes WHERE telefone = ?',
    [telefoneLimpo]
  ) as [Cliente[], any];

  if (rows.length > 0) {
    console.log('[ClienteService] Resultado da busca: Cliente encontrado');
    console.log('[ClienteService] Cliente existente:', rows[0]);
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
  console.log('[ClienteService] Resultado da busca: Cliente não encontrado');
  console.log('[ClienteService] Criando novo cliente com telefone:', telefoneLimpo);
  console.log('[ClienteService] Cliente criado com ID:', result.insertId);
  console.log('[ClienteService] Cliente criado:', newRows[0]);
  return newRows[0];
};
