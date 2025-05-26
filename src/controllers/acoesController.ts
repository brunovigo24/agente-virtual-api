import { Request, Response } from 'express';
import * as acoesService from '../services/acoesService';

export const criar = async (req: Request, res: Response) => {
  const id = await acoesService.criarAcao(req.body);
  res.status(201).json({ id });
};

export const listar = async (_: Request, res: Response) => {
  const acoes = await acoesService.listarAcoes();
  res.json(acoes);
};

export const buscarPorEtapa = async (req: Request, res: Response) => {
  const etapa = req.params.etapa;
  const acao = await acoesService.buscarPorEtapa(etapa);
  res.json(acao);
};

export const atualizar = async (req: Request, res: Response) => {
  const opcao = req.body.opcao;
  await acoesService.atualizarAcao(Number(req.params.id), opcao, req.body);
  res.json({ sucesso: true });
};

export const deletar = async (req: Request, res: Response) => {
  await acoesService.deletarAcao(Number(req.params.id));
  res.json({ sucesso: true });
};
