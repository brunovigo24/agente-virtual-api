import { Request, Response, NextFunction } from 'express';
import { lerJson, salvarJson } from '../utils/jsonLoader';

export const getFluxo = (req: Request, res: Response): void => {
  const fluxo = lerJson('fluxoEtapas.json');
  res.json(fluxo);
};

export const atualizarEtapa = (req: Request, res: Response): void => {
  const { etapa } = req.params;
  const novaEtapa = req.body;

  if (!etapa || !novaEtapa) {
    res.status(400).json({ erro: 'Etapa ou conteúdo não informados' });
    return;
  }

  const fluxo = lerJson('fluxoEtapas.json');
  fluxo[etapa] = novaEtapa;

  salvarJson('fluxoEtapas.json', fluxo);
  res.json({ sucesso: true, etapaAtualizada: etapa });
};
