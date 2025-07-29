import db from '../database';
import { ResultSetHeader } from 'mysql2';
import * as acaoArquivosService from './acaoArquivosService';
import { AcaoComArquivos } from '../interfaces/AcaoArquivo';

export const criarAcao = async (dados: {
  etapa: string;
  opcao: string;
  acao_tipo: string;
  conteudo: string;
  aguarda_resposta?: boolean;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO acoes_automatizadas (etapa, opcao, acao_tipo, conteudo, aguarda_resposta) VALUES (?, ?, ?, ?, ?)',
    [dados.etapa, dados.opcao, dados.acao_tipo, dados.conteudo, dados.aguarda_resposta || false]
  );
  return result.insertId;
};

export const listarAcoes = async () => {
  const [rows] = await db.query(
    'SELECT * FROM acoes_automatizadas ORDER BY etapa ASC'
  );
  return rows;
};

export const buscarPorId = async (id: number): Promise<AcaoComArquivos | null> => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM acoes_automatizadas WHERE id = ? LIMIT 1',
    [id]
  );
  
  const acao = rows[0];
  if (!acao) return null;
  
  const arquivos = await acaoArquivosService.buscarArquivosPorAcao(acao.id);
  
  return {
    ...acao,
    arquivos
  } as AcaoComArquivos;
};

export const listarAcoesComArquivos = async (): Promise<AcaoComArquivos[]> => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM acoes_automatizadas ORDER BY etapa ASC'
  );
  
  const acoesComArquivos: AcaoComArquivos[] = [];
  
  for (const acao of rows) {
    const arquivos = await acaoArquivosService.buscarArquivosPorAcao(acao.id);
    acoesComArquivos.push({
      ...acao,
      arquivos
    } as AcaoComArquivos);
  }
  
  return acoesComArquivos;
};

export const buscarPorEtapaEOpcoes = async (etapa: string, opcao: string): Promise<AcaoComArquivos | null> => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM acoes_automatizadas WHERE etapa = ? AND opcao = ? LIMIT 1',
    [etapa, opcao]
  );
  
  const acao = rows[0];
  if (!acao) return null;
  
  const arquivos = await acaoArquivosService.buscarArquivosPorAcao(acao.id);
  
  return {
    ...acao,
    arquivos
  } as AcaoComArquivos;
};

export const atualizarAcao = async (id: number, opcao: string, dados: { acao_tipo: string; conteudo: string; aguarda_resposta?: boolean; }) => {
  await db.query(
    'UPDATE acoes_automatizadas SET acao_tipo = ?, conteudo = ?, aguarda_resposta = ? WHERE id = ? AND opcao = ?',
    [dados.acao_tipo, dados.conteudo, dados.aguarda_resposta || false, id, opcao]
  );
};

export const deletarAcao = async (id: number) => {
  await acaoArquivosService.removerArquivosPorAcao(id);
  await db.query('DELETE FROM acoes_automatizadas WHERE id = ?', [id]);
};
