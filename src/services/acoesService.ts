import db from '../database';
import { ResultSetHeader } from 'mysql2';

export const criarAcao = async (dados: {
  etapa: string;
  opcao: string;
  acao_tipo: string;
  conteudo: string;
  arquivo?: Buffer | null;
  arquivo_nome?: string | null;
  arquivo_tipo?: string | null;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO acoes_automatizadas (etapa, opcao, acao_tipo, conteudo, arquivo, arquivo_nome, arquivo_tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [dados.etapa, dados.opcao, dados.acao_tipo, dados.conteudo, dados.arquivo, dados.arquivo_nome, dados.arquivo_tipo]
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
};// Alterar lógica, tem que buscar opção também 

export const atualizarAcao = async (id: number, opcao: string, dados: { acao_tipo: string; conteudo: string; arquivo?: Buffer | null; arquivo_nome?: string | null; arquivo_tipo?: string | null; }) => {
  await db.query(
    'UPDATE acoes_automatizadas SET acao_tipo = ?, conteudo = ?, arquivo = ?, arquivo_nome = ?, arquivo_tipo = ? WHERE id = ? AND opcao = ?',
    [dados.acao_tipo, dados.conteudo, dados.arquivo, dados.arquivo_nome, dados.arquivo_tipo, id, opcao]
  );
};

export const deletarAcao = async (id: number) => {
  await db.query('DELETE FROM acoes_automatizadas WHERE id = ?', [id]);
};
