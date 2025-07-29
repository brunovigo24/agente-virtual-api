import db from '../database';
import { Mensagem, MensagemComArquivos } from '../interfaces/Mensagem';
import * as minioService from './minioService';

interface ArquivoInfo {
  buffer: Buffer;
  nome: string;
  tipo: string;
  tamanho: number;
}

type TipoMensagem = 'entrada' | 'saida';

const inserirMensagem = async (
  conversaId: number, 
  mensagem: string, 
  tipo: TipoMensagem
): Promise<number> => {
  const [result] = await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, ?, NOW())`,
    [conversaId, mensagem, tipo]
  );
  
  return (result as any).insertId;
};

const buscarMensagensPorConversa = async (conversaId: number): Promise<Mensagem[]> => {
  const [rows] = await db.query(
    `SELECT * FROM mensagens 
     WHERE conversa_id = ?
     ORDER BY data_hora ASC`,
    [conversaId]
  ) as [Mensagem[], any];
  
  return rows;
};

export const registrarEntrada = async (
  conversaId: number, 
  mensagem: string, 
  arquivo?: ArquivoInfo
): Promise<number> => {
  const mensagemId = await inserirMensagem(conversaId, mensagem, 'entrada');
  
  if (arquivo) {
    await minioService.salvarArquivo(mensagemId, arquivo);
  }
  
  return mensagemId;
};

export const registrarSaida = async (conversaId: number, mensagem: string): Promise<void> => {
  await inserirMensagem(conversaId, mensagem, 'saida');
};

export const getMensagens = async (conversaId: number): Promise<Mensagem[]> => {
  return buscarMensagensPorConversa(conversaId);
};

export const getMensagensComArquivos = async (conversaId: number): Promise<MensagemComArquivos[]> => {
  const mensagens = await buscarMensagensPorConversa(conversaId);
  
  const mensagensComArquivos = await Promise.all(
    mensagens.map(async (mensagem) => {
      const arquivos = await minioService.buscarArquivosMinioPorMensagem(mensagem.id);
      return {
        ...mensagem,
        arquivos
      } as MensagemComArquivos;
    })
  );
  
  return mensagensComArquivos;
};
