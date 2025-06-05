import pool from '../database';
import { EvolutionInstance } from '../interfaces/EvolutionInstance';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Salva uma nova instância no banco de dados
 */
export async function salvarInstancia(instancia: EvolutionInstance): Promise<number> {
  const connection = await pool.getConnection();
  
  try {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO evolution_instances 
       (instance_name, instance_id, hash, status, webhook_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        instancia.instance_name,
        instancia.instance_id,
        instancia.hash,
        instancia.status,
        instancia.webhook_url || null
      ]
    );
    
    return result.insertId;
  } finally {
    connection.release();
  }
}

/**
 * Busca uma instância pelo nome
 */
export async function buscarInstanciaPorNome(instanceName: string): Promise<EvolutionInstance | null> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM evolution_instances WHERE instance_name = ?',
      [instanceName]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as EvolutionInstance;
  } finally {
    connection.release();
  }
}

/**
 * Lista todas as instâncias ativas
 */
export async function listarInstancias(): Promise<EvolutionInstance[]> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM evolution_instances ORDER BY created_at DESC'
    );
    
    return rows as EvolutionInstance[];
  } finally {
    connection.release();
  }
}

/**
 * Atualiza o status de uma instância
 */
export async function atualizarStatusInstancia(instanceName: string, status: string): Promise<void> {
  const connection = await pool.getConnection();
  
  try {
    await connection.execute(
      'UPDATE evolution_instances SET status = ? WHERE instance_name = ?',
      [status, instanceName]
    );
  } finally {
    connection.release();
  }
}

/**
 * Remove uma instância do banco
 */
export async function removerInstancia(instanceName: string): Promise<void> {
  const connection = await pool.getConnection();
  
  try {
    await connection.execute(
      'DELETE FROM evolution_instances WHERE instance_name = ?',
      [instanceName]
    );
  } finally {
    connection.release();
  }
}

/**
 * Busca instância ativa (primeira encontrada)
 * Para uso temporário até implementar seleção dinâmica
 */
export async function buscarInstanciaAtiva(): Promise<EvolutionInstance | null> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT * FROM evolution_instances 
       WHERE status IN ('open', 'connecting') 
       ORDER BY updated_at DESC 
       LIMIT 1`
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as EvolutionInstance;
  } finally {
    connection.release();
  }
} 