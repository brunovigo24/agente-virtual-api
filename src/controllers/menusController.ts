import { Request, Response } from 'express';
import { lerJson, salvarJson } from '../utils/jsonLoader';

export const getMenus = (req: Request, res: Response) => {
  const menus = lerJson('menus.json');
  res.json(menus);
};

export const atualizarMenu = (req: Request, res: Response) => {
  const { chave } = req.params; // ex: "menu_principal"
  const novoMenu = req.body;

  const menus = lerJson('menus.json');
  menus[chave] = novoMenu;

  salvarJson('menus.json', menus);
  res.json({ sucesso: true, chaveAtualizada: chave });
};
