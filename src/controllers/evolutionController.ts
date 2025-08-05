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

export const gerarQRPairing = async (req: Request, res: Response) => {
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

export const statusInstancia = async (req: Request, res: Response) => {
  const { nome } = req.params;

  try {
    const resultado = await evolutionManager.statusInstancia(nome);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao consultar status da instância',
      detalhes: error instanceof Error ? error.message : error
    });
  }
};

export const listarInstancias = async (req: Request, res: Response) => {
  try {
    const resultado = await evolutionManager.fetchAllInstancias();
    console.log(resultado);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao listar instâncias',
      detalhes: error instanceof Error ? error.message : error
    });
  }
};

export const deletarInstancia = async (req: Request, res: Response) => {
  const { instance } = req.params;
  try {
    const resultado = await evolutionManager.deleteInstancia(instance);
    res.json({ sucesso: true, resultado });
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao deletar instância',
      detalhes: error instanceof Error ? error.message : error,
    });
  }
};

export const logoutInstancia = async (req: Request, res: Response) => {
  const { instance } = req.params;
  try {
    const resultado = await evolutionManager.logoutInstancia(instance);
    res.json({ sucesso: true, resultado });
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao realizar logout da instância',
      detalhes: error instanceof Error ? error.message : error,
    });
  }
};

export const restartInstancia = async (req: Request, res: Response) => {
  const { instance } = req.params;
  try {
    const resultado = await evolutionManager.restartInstancia(instance);
    res.json({ sucesso: true, resultado });
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao reiniciar a instância',
      detalhes: error instanceof Error ? error.message : error,
    });
  }
};