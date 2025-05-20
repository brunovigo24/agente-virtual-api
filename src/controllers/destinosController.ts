import { Request, Response } from 'express';
import { lerJson, salvarJson } from '../utils/jsonLoader';

export const getDestinos = (req: Request, res: Response) => {
  const destinos = lerJson('destinosTransferencia.json');
  res.json(destinos);
};

export const atualizarDestino = (req: Request, res: Response) => {
  const { chave } = req.params;
  const { conteudo } = req.body;

  const destinos = lerJson('destinosTransferencia.json');
  destinos[chave] = conteudo;

  salvarJson('destinosTransferencia.json', destinos);
  res.json({ sucesso: true });
};
