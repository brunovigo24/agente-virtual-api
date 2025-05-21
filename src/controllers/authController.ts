import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as userService from '../services/userService';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = await userService.findByUsername(username);
  if (!user) {
    res.status(401).json({ erro: 'Usuário inválido' });
    return;
  }

  const senhaCorreta = await bcrypt.compare(password, user.password);
  if (!senhaCorreta) {
    res.status(401).json({ erro: 'Senha incorreta' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'segredo',
    { expiresIn: '1h' }
  );

  res.json({ token });
};
