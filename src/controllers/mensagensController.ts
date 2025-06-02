import { Request, Response } from 'express';
import { lerJson, salvarJson } from '../utils/jsonLoader';

export const getMensagens = (req: Request, res: Response) => {
  const mensagens = lerJson('mensagensSistema.json');
  res.json(mensagens);
};

export const atualizarMensagem = (req: Request, res: Response) => {
  const { chave } = req.params;
  const { conteudo } = req.body;

  const mensagens = lerJson('mensagensSistema.json');
  mensagens[chave] = conteudo;

  salvarJson('mensagensSistema.json', mensagens);
  res.json({ sucesso: true });
};
