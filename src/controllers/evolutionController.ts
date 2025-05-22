import { Request, Response } from 'express';
import * as evolutionManager from '../services/evolutionManagerService';

export const criarInstancia = async (req: Request, res: Response) => {
  const { nome, numero } = req.body;
  try {
    const resultado = await evolutionManager.criarInstancia(nome, numero);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar instância', detalhes: error instanceof Error ? error.message : error });
  }
};

export const gerarQR = async (req: Request, res: Response) => {
  const { nome } = req.params;
  try {
    const resultado = await evolutionManager.gerarQR(nome);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao gerar QR Code',
      detalhes: error instanceof Error ? error.message : error,
    });
  }
};

// export const gerarPairing = async (req: Request, res: Response) => {
//   const nome = req.params.nome;
//   const resultado = await evolutionManager.gerarPairingCode(nome);
//   res.json(resultado);
// };

// export const statusInstancia = async (req: Request, res: Response) => {
//   const nome = req.params.nome;
//   const resultado = await evolutionManager.obterStatus(nome);
//   res.json(resultado);
// };
