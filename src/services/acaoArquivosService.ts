import db from '../database';
import { ResultSetHeader } from 'mysql2';
import { AcaoArquivo } from '../interfaces/AcaoArquivo';

export const adicionarArquivo = async (dados: {
  acao_id: number;
  arquivo: Buffer;
  arquivo_nome: string;
  arquivo_tipo: string;
  ordem: number;
}) => {
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO acao_arquivos (acao_id, arquivo, arquivo_nome, arquivo_tipo, ordem) VALUES (?, ?, ?, ?, ?)',
    [dados.acao_id, dados.arquivo, dados.arquivo_nome, dados.arquivo_tipo, dados.ordem]
  );
  return result.insertId;
};

export const buscarArquivosPorAcao = async (acao_id: number): Promise<AcaoArquivo[]> => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM acao_arquivos WHERE acao_id = ? ORDER BY ordem ASC',
    [acao_id]
  );
  return rows as AcaoArquivo[];
};

export const adicionarMultiplosArquivos = async (acao_id: number, arquivos: Express.Multer.File[]): Promise<number[]> => {
  const ids: number[] = [];
  
  for (let i = 0; i < arquivos.length; i++) {
    const arquivo = arquivos[i];
    const id = await adicionarArquivo({
      acao_id,
      arquivo: arquivo.buffer,
      arquivo_nome: arquivo.originalname,
      arquivo_tipo: arquivo.mimetype,
      ordem: i + 1
    });
    ids.push(id);
  }
  
  return ids;
};

export const removerArquivosPorAcao = async (acao_id: number): Promise<void> => {
  await db.query('DELETE FROM acao_arquivos WHERE acao_id = ?', [acao_id]);
};

export const removerArquivo = async (id: number): Promise<void> => {
  await db.query('DELETE FROM acao_arquivos WHERE id = ?', [id]);
};

export const contarArquivosPorAcao = async (acao_id: number): Promise<number> => {
  const [rows] = await db.query<any[]>(
    'SELECT COUNT(*) as total FROM acao_arquivos WHERE acao_id = ?',
    [acao_id]
  );
  return rows[0]?.total || 0;
}; 