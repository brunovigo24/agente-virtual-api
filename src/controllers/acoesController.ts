import { Request, Response } from 'express';
import * as acoesService from '../services/acoesService';
import * as acaoArquivosService from '../services/acaoArquivosService';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export const criar = async (req: Request, res: Response) => {
  try {
    const mReq = req as MulterRequest;
    const { etapa, opcao, acao_tipo, conteudo } = req.body;

    // Criar ação principal
    const acaoId = await acoesService.criarAcao({
      etapa,
      opcao,
      acao_tipo,
      conteudo
    });

    // Adicionar arquivos se existirem (múltiplos arquivos)
    if (mReq.files && mReq.files.length > 0) {
      await acaoArquivosService.adicionarMultiplosArquivos(acaoId, mReq.files);
    }
    else if (mReq.file) {
      await acaoArquivosService.adicionarArquivo({
        acao_id: acaoId,
        arquivo: mReq.file.buffer,
        arquivo_nome: mReq.file.originalname,
        arquivo_tipo: mReq.file.mimetype,
        ordem: 1
      });
    }

    res.status(201).json({ id: acaoId });
  } catch (error) {
    console.error('Erro ao criar ação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const incluirArquivos = req.query.incluirArquivos === 'true';
    
    if (incluirArquivos) {
      const acoes = await acoesService.listarAcoesComArquivos();
      res.json(acoes);
    } else {
      const acoes = await acoesService.listarAcoes();
      res.json(acoes);
    }
  } catch (error) {
    console.error('Erro ao listar ações:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const acao = await acoesService.buscarPorId(id);
    
    if (!acao) {
      return res.status(404).json({ erro: 'Ação não encontrada' });
    }
    
    res.json(acao);
  } catch (error) {
    console.error('Erro ao buscar ação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const buscarPorEtapa = async (req: Request, res: Response) => {
  try {
    const etapa = req.params.etapa;
    const opcao = req.params.opcao;
    const acao = await acoesService.buscarPorEtapaEOpcoes(etapa, opcao);
    res.json(acao);
  } catch (error) {
    console.error('Erro ao buscar ação por etapa:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const atualizar = async (req: Request, res: Response) => {
  try {
    const mReq = req as MulterRequest;
    const acaoId = Number(req.params.id);
    const opcao = req.body.opcao;

    await acoesService.atualizarAcao(acaoId, opcao, {
      acao_tipo: req.body.acao_tipo,
      conteudo: req.body.conteudo
    });

    // Se houver novos arquivos, substituir os existentes
    if (mReq.files && mReq.files.length > 0) {
      // Remove arquivos antigos
      await acaoArquivosService.removerArquivosPorAcao(acaoId);
      // Adiciona novos arquivos
      await acaoArquivosService.adicionarMultiplosArquivos(acaoId, mReq.files);
    }
    // Compatibilidade com arquivo único
    else if (mReq.file) {
      await acaoArquivosService.removerArquivosPorAcao(acaoId);
      await acaoArquivosService.adicionarArquivo({
        acao_id: acaoId,
        arquivo: mReq.file.buffer,
        arquivo_nome: mReq.file.originalname,
        arquivo_tipo: mReq.file.mimetype,
        ordem: 1
      });
    }

    res.json({ sucesso: true });
  } catch (error) {
    console.error('Erro ao atualizar ação:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const deletar = async (req: Request, res: Response) => {
  await acoesService.deletarAcao(Number(req.params.id));
  res.json({ sucesso: true });
};
