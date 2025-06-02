import { Request, Response } from 'express';
import * as acoesService from '../services/acoesService';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const criar = async (req: Request, res: Response) => {
  const mReq = req as MulterRequest;
  const { etapa, opcao, acao_tipo, conteudo } = req.body;
  const arquivo = mReq.file ? mReq.file.buffer : null;
  const arquivo_nome = mReq.file ? mReq.file.originalname : null;
  const arquivo_tipo = mReq.file ? mReq.file.mimetype : null;

  const id = await acoesService.criarAcao({
    etapa,
    opcao,
    acao_tipo,
    conteudo,
    arquivo,
    arquivo_nome,
    arquivo_tipo
  });
  res.status(201).json({ id });
};

export const listar = async (_: Request, res: Response) => {
  const acoes = await acoesService.listarAcoes();
  res.json(acoes);
};

export const buscarPorEtapa = async (req: Request, res: Response) => {
  const etapa = req.params.etapa;
  const opcao = req.params.opcao;
  const acao = await acoesService.buscarPorEtapaEOpcoes(etapa, opcao);
  res.json(acao);
};

export const atualizar = async (req: Request, res: Response) => {
  const mReq = req as MulterRequest;
  const opcao = req.body.opcao;
  const arquivo = mReq.file ? mReq.file.buffer : null;
  const arquivo_nome = mReq.file ? mReq.file.originalname : null;
  const arquivo_tipo = mReq.file ? mReq.file.mimetype : null;
  await acoesService.atualizarAcao(Number(req.params.id), opcao, {
    acao_tipo: req.body.acao_tipo,
    conteudo: req.body.conteudo,
    arquivo,
    arquivo_nome,
    arquivo_tipo
  });
  res.json({ sucesso: true });
};

export const deletar = async (req: Request, res: Response) => {
  await acoesService.deletarAcao(Number(req.params.id));
  res.json({ sucesso: true });
};
