import { Client } from 'minio';
import db from '../database';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || '';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || '';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'app-media';

export interface MinioFile {
  name: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
}

export interface MinioFileContent {
  buffer: Buffer;
  name: string;
  contentType: string;
  size: number;
}

const url = new URL(MINIO_ENDPOINT);
const minioClient = new Client({
  endPoint: url.hostname,
  port: Number(url.port) || 9000,
  useSSL: url.protocol === 'https:',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

const verificarBucket = async (): Promise<void> => {
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
    console.log(`[MinIO] Bucket ${MINIO_BUCKET} existe: ${bucketExists}`);
  } catch (error) {
    console.error(`[MinIO] Erro ao verificar bucket:`, error);
  }
};

verificarBucket();

const buscarTelefonePorConversa = async (conversaId: number): Promise<string | null> => {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT cl.telefone 
       FROM conversas c 
       JOIN clientes cl ON c.id_cliente = cl.id 
       WHERE c.id = ?`,
      [conversaId]
    );

    return rows[0]?.telefone || null;
  } catch (error) {
    console.error('[MinIO] Erro ao buscar telefone da conversa:', error);
    return null;
  }
};

const buscarMensagensEntrada = async (conversaId: number): Promise<any[]> => {
  try {
    const [rows] = await db.query<any[]>(
      `SELECT id, mensagem, data_hora 
       FROM mensagens 
       WHERE conversa_id = ? AND tipo = 'entrada'
       ORDER BY data_hora ASC`,
      [conversaId]
    );

    return rows;
  } catch (error) {
    console.error('[MinIO] Erro ao buscar mensagens de entrada:', error);
    return [];
  }
};

const extrairNomeOriginal = async (fileName: string): Promise<string> => {
  try {
    const stat = await minioClient.statObject(MINIO_BUCKET, fileName);
    return stat.metaData?.['x-original-name'] || fileName;
  } catch {
    return fileName;
  }
};

const processarArquivo = async (arquivoMinio: MinioFile): Promise<MinioFileContent | null> => {
  const conteudo = await baixarArquivo(arquivoMinio.name);
  if (!conteudo || conteudo.buffer.length === 0) {
    return null;
  }

  conteudo.name = await extrairNomeOriginal(arquivoMinio.name);
  return conteudo;
};

export const listarArquivos = async (): Promise<MinioFile[]> => {
  try {
    const stream = minioClient.listObjects(MINIO_BUCKET, '', true);
    const arquivos: MinioFile[] = [];

    for await (const obj of stream) {
      arquivos.push({
        name: obj.name,
        size: obj.size,
        lastModified: obj.lastModified,
        etag: obj.etag,
        contentType: obj.metaData?.['content-type']
      });
    }

    return arquivos;
  } catch (error: any) {
    console.error('[MinIO] Erro ao listar arquivos:', error.message);
    return [];
  }
};

export const buscarArquivosPorConversa = async (conversaId: number): Promise<MinioFile[]> => {
  try {
    const telefone = await buscarTelefonePorConversa(conversaId);
    if (!telefone) {
      return [];
    }

    const todosArquivos = await listarArquivos();
    const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');

    return todosArquivos.filter(arquivo => {
      const nome = arquivo.name.toLowerCase();
      const caminhoEvolution = `evolution-api/${numeroLimpo}`;
      const caminhoCompleto = `evolution-api/${numeroLimpo}@s.whatsapp.net`;

      return nome.includes(caminhoEvolution.toLowerCase()) ||
        nome.includes(caminhoCompleto.toLowerCase()) ||
        nome.includes(numeroLimpo.toLowerCase());
    });
  } catch (error: any) {
    console.error('[MinIO] Erro ao buscar arquivos por conversa:', error.message);
    return [];
  }
};

export const buscarArquivosPorMensagem = async (mensagemId: number): Promise<MinioFile[]> => {
  try {
    const todosArquivos = await listarArquivos();
    const padraoMsg = `msg_${mensagemId}_`;
    const padraoMensagem = `mensagem_${mensagemId}`;

    return todosArquivos.filter(arquivo => {
      const nome = arquivo.name.toLowerCase();
      return nome.includes(padraoMsg.toLowerCase()) ||
        nome.includes(padraoMensagem.toLowerCase());
    });
  } catch (error: any) {
    console.error('[MinIO] Erro ao buscar arquivos por mensagem:', error.message);
    return [];
  }
};

export const baixarArquivo = async (fileName: string): Promise<MinioFileContent | null> => {
  try {
    const stream = await minioClient.getObject(MINIO_BUCKET, fileName);
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }

    const buffer = Buffer.concat(chunks);
    if (buffer.length === 0) {
      return null;
    }

    let contentType = 'application/octet-stream';
    try {
      const stat = await minioClient.statObject(MINIO_BUCKET, fileName);
      contentType = stat.metaData?.['content-type'] || contentType;
    } catch {
    }

    return {
      buffer,
      name: fileName,
      contentType,
      size: buffer.length
    };
  } catch (error: any) {
    console.error(`[MinIO] Erro ao baixar arquivo ${fileName}:`, error.message);
    return null;
  }
};

export const buscarArquivosMinioPorConversa = async (conversaId: number): Promise<MinioFileContent[]> => {
  try {
    const arquivosMinio = await buscarArquivosPorConversa(conversaId);
    const arquivosConteudo: MinioFileContent[] = [];

    for (const arquivoMinio of arquivosMinio) {
      const conteudo = await processarArquivo(arquivoMinio);
      if (conteudo) {
        arquivosConteudo.push(conteudo);
      }
    }

    return arquivosConteudo;
  } catch (error: any) {
    console.error('[MinIO] Erro ao buscar arquivos MinIO por conversa:', error.message);
    return [];
  }
};

export const buscarArquivosMinioPorConversaApenasEntrada = async (conversaId: number): Promise<MinioFileContent[]> => {
  try {
    const mensagensEntrada = await buscarMensagensEntrada(conversaId);
    if (mensagensEntrada.length === 0) {
      return [];
    }

    const arquivosConteudo: MinioFileContent[] = [];

    for (const mensagem of mensagensEntrada) {
      const arquivosMensagem = await buscarArquivosPorMensagem(mensagem.id);

      for (const arquivoMinio of arquivosMensagem) {
        const conteudo = await processarArquivo(arquivoMinio);
        if (conteudo) {
          arquivosConteudo.push(conteudo);
        }
      }
    }

    return arquivosConteudo;
  } catch (error: any) {
    console.error('[MinIO] Erro ao buscar arquivos MinIO por conversa (apenas entrada):', error.message);
    return [];
  }
};

export const buscarArquivosMinioPorMensagem = async (mensagemId: number): Promise<MinioFileContent[]> => {
  try {
    const arquivosMinio = await buscarArquivosPorMensagem(mensagemId);
    const arquivosConteudo: MinioFileContent[] = [];

    for (const arquivoMinio of arquivosMinio) {
      const conteudo = await processarArquivo(arquivoMinio);
      if (conteudo) {
        arquivosConteudo.push(conteudo);
      }
    }

    return arquivosConteudo;
  } catch (error: any) {
    console.error('[MinIO] Erro ao buscar arquivos MinIO por mensagem:', error.message);
    return [];
  }
};

export const salvarArquivo = async (mensagemId: number, arquivo: {
  buffer: Buffer;
  nome: string;
  tipo: string;
  tamanho: number;
}): Promise<void> => {
  try {
    const timestamp = Date.now();
    const extensao = arquivo.nome.split('.').pop() || arquivo.tipo.split('/')[1] || 'bin';
    const nomeArquivo = `msg_${mensagemId}_${timestamp}.${extensao}`;

    await minioClient.putObject(
      MINIO_BUCKET,
      nomeArquivo,
      arquivo.buffer,
      arquivo.tamanho,
      {
        'content-type': arquivo.tipo,
        'x-mensagem-id': mensagemId.toString(),
        'x-original-name': arquivo.nome
      }
    );

    console.log(`[MinIO] Arquivo salvo: ${nomeArquivo} (${arquivo.tamanho} bytes)`);
  } catch (error: any) {
    console.error('[MinIO] Erro ao salvar arquivo:', error.message);
    throw error;
  }
};

export const deletarArquivo = async (fileName: string): Promise<void> => {
  try {
    await minioClient.removeObject(MINIO_BUCKET, fileName);
  } catch (error: any) {
    console.error(`[MinIO] Erro ao deletar arquivo ${fileName}:`, error.message);
    throw error;
  }
};

export const deletarArquivosPorNumero = async (numero: string): Promise<void> => {
  try {
    const numeroLimpo = numero.replace(/@s\.whatsapp\.net$/, '');
    const todosArquivos = await listarArquivos();

    const arquivosParaDeletar = todosArquivos.filter(arquivo => {
      const nome = arquivo.name.toLowerCase();
      const caminhoEvolution = `evolution-api/${numeroLimpo}`;
      const caminhoCompleto = `evolution-api/${numeroLimpo}@s.whatsapp.net`;

      return nome.includes(caminhoEvolution.toLowerCase()) ||
        nome.includes(caminhoCompleto.toLowerCase()) ||
        nome.includes(numeroLimpo.toLowerCase());
    });

    if (arquivosParaDeletar.length === 0) {
      return;
    }

    for (const arquivo of arquivosParaDeletar) {
      try {
        await deletarArquivo(arquivo.name);
      } catch (error) {
        console.error(`[MinIO] Erro ao deletar arquivo ${arquivo.name}:`, error);
        // Continua deletando outros arquivos mesmo se um falhar
      }
    }
  } catch (error: any) {
    console.error(`[MinIO] Erro ao deletar arquivos do número ${numero}:`, error.message);
    throw error;
  }
};

export const deletarArquivosPorConversa = async (conversaId: number): Promise<void> => {
  try {
    const telefone = await buscarTelefonePorConversa(conversaId);
    if (!telefone) {
      return;
    }

    await deletarArquivosPorNumero(telefone);
  } catch (error: any) {
    console.error(`[MinIO] Erro ao deletar arquivos da conversa ${conversaId}:`, error.message);
    throw error;
  }
};

export const buscarUltimaMidiaUsuario = async (telefone: string): Promise<MinioFileContent | null> => {
  try {
    const todosArquivos = await listarArquivos();
    const numeroCompleto = telefone.toLowerCase();

    const tiposMensagem = ['imagemessage', 'documentmessage', 'videomessage', 'audiomessage', 'sticker'];

    const arquivosUsuario = todosArquivos.filter(arquivo => {
      const nome = arquivo.name.toLowerCase();

      if (!nome.includes(numeroCompleto)) {
        return false;
      }

      const partes = nome.split('/');
      const indexNumero = partes.findIndex(parte => parte.toLowerCase() === numeroCompleto);

      if (indexNumero === -1) {
        return false;
      }

      const parteAposNumero = partes[indexNumero + 1];
      if (!parteAposNumero) {
        return false;
      }

      return tiposMensagem.includes(parteAposNumero.toLowerCase());
    });

    if (arquivosUsuario.length === 0) {
      return null;
    }

    const extensoesValidas = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'mp3', 'wav', 'ogg', 'm4a', 'pdf', 'doc', 'docx', 'txt', 'rtf'];

    const arquivosComExtensao = arquivosUsuario.filter(arquivo => {
      const extensao = arquivo.name.split('.').pop()?.toLowerCase();
      return extensao && extensoesValidas.includes(extensao);
    });

    if (arquivosComExtensao.length === 0) {
      return null;
    }

    // Ordenar por data de modificação (mais novo primeiro)
    arquivosComExtensao.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    const arquivoMaisNovo = arquivosComExtensao[0];

    const conteudo = await baixarArquivo(arquivoMaisNovo.name);
    if (!conteudo || conteudo.buffer.length === 0) {
      return null;
    }

    return conteudo;
  } catch (error: any) {
    console.error(`[MinIO] Erro ao buscar última mídia do usuário ${telefone}:`, error.message);
    return null;
  }
};