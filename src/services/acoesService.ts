import db from '../database';
import { ResultSetHeader } from 'mysql2';

export const criarAcao = async (dados: {
  etapa: string;
  opcao: string;
  acao_tipo: string;
  conteudo: string;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO acoes_automatizadas (etapa, opcao, acao_tipo, conteudo) VALUES (?, ?, ?, ?)',
    [dados.etapa, dados.opcao, dados.acao_tipo, dados.conteudo]
  );
  return result.insertId;
};

export const listarAcoes = async () => {
  const [rows] = await db.query(
    'SELECT * FROM acoes_automatizadas ORDER BY etapa ASC'
  );
  return rows;
};

export const buscarPorEtapa = async (etapa: string) => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM acoes_automatizadas WHERE etapa = ? LIMIT 1',
    [etapa]
  );
  return rows[0] || null;
};

export const atualizarAcao = async (id: number, opcao: string, dados: { acao_tipo: string; conteudo: string }) => {
  await db.query(
    'UPDATE acoes_automatizadas SET acao_tipo = ?, conteudo = ? WHERE id = ? AND opcao = ?',
    [dados.acao_tipo, dados.conteudo, id, opcao]
  );
};

export const deletarAcao = async (id: number) => {
  await db.query('DELETE FROM acoes_automatizadas WHERE id = ?', [id]);
};
