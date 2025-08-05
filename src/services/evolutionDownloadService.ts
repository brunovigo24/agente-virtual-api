import axios from 'axios';
import { buscarInstanciaAtiva } from './evolutionInstanceService';

const API_URL = process.env.EVOLUTION_API_URL;
const TIMEOUT = 30000;

export interface ArquivoInfo {
  url: string;
  mimetype: string;
  fileName?: string;
  caption?: string;
  fileLength?: string;
  mediaKey?: string;
  directPath?: string;
  messageId?: string;
}

interface DownloadResult {
  buffer: Buffer;
  nome: string;
  tipo: string;
  tamanho: number;
}

const extrairNumero = (url: string): string => {
  if (url.includes('@s.whatsapp.net')) {
    return url.split('@')[0];
  }
  const match = url.match(/(\d{10,})/);
  return match ? match[1] : '';
};

const criarPayload = (arquivoInfo: ArquivoInfo, numero: string) => ({
  number: numero,
  messageId: arquivoInfo.messageId || '',
  mediaKey: arquivoInfo.mediaKey || '',
  directPath: arquivoInfo.directPath || ''
});

const fazerDownloadViaAPI = async (downloadUrl: string, payload: any, hash: string): Promise<any> => {
  return axios.post(downloadUrl, payload, {
    headers: {
      'apikey': hash,
      'Content-Type': 'application/json'
    },
    timeout: TIMEOUT
  });
};

const converterParaBuffer = (data: any): Buffer => {
  if (data.base64) {
    return Buffer.from(data.base64, 'base64');
  }
  if (data.media) {
    return Buffer.from(data.media, 'base64');
  }
  return Buffer.from(data);
};

const gerarNomeArquivo = (arquivoInfo: ArquivoInfo): string => {
  if (arquivoInfo.fileName) {
    return arquivoInfo.fileName;
  }
  const extensao = arquivoInfo.mimetype.split('/')[1] || 'bin';
  return `arquivo_${Date.now()}.${extensao}`;
};

export const baixarArquivo = async (arquivoInfo: ArquivoInfo): Promise<DownloadResult> => {
  const instancia = await buscarInstanciaAtiva();
  
  if (!instancia) {
    throw new Error('Nenhuma instância ativa encontrada no banco de dados');
  }

  try {
    const downloadUrl = `${API_URL}/chat/findBase64/${instancia.instance_name}`;
    const numero = extrairNumero(arquivoInfo.url);
    const payload = criarPayload(arquivoInfo, numero);

    let response;
    try {
      response = await fazerDownloadViaAPI(downloadUrl, payload, instancia.hash);
    } catch (apiError: any) {
      throw apiError;
    }

    if (!response.data) {
      throw new Error('Resposta vazia da Evolution API');
    }

    const buffer = converterParaBuffer(response.data);

    if (buffer.length === 0) {
      throw new Error('Buffer convertido está vazio');
    }

    const nome = gerarNomeArquivo(arquivoInfo);

    return {
      buffer,
      nome,
      tipo: arquivoInfo.mimetype,
      tamanho: buffer.length
    };

  } catch (error: any) {
    console.error('[Download] Erro:', error.message);
    throw error;
  }
};

// const isMensagemDoBot = (dados: any): boolean => {
//   return dados?.data?.key?.fromMe === true;
// };

const isMensagemDoUsuario = (dados: any): boolean => {
  const { remoteJid, pushName } = dados?.data?.key || {};
  
  return remoteJid && 
         pushName &&
         remoteJid.includes('@s.whatsapp.net') &&
         !remoteJid.includes('status') &&
         !remoteJid.includes('g.us');
};

const temCaracteristicasDoBot = (conversation: string): boolean => {
  const botKeywords = ['Aurora', 'CCIM', 'assistente virtual', 'atendimento'];
  return botKeywords.some(keyword => conversation.includes(keyword));
};

const extrairArquivoDeMensagem = (messageData: any, messageId: string): ArquivoInfo | null => {
  const tiposArquivo = [
    {
      key: 'imageMessage',
      defaultMimetype: 'image/jpeg',
      defaultExtensao: 'jpg',
      prefixo: 'imagem'
    },
    {
      key: 'documentMessage',
      defaultMimetype: 'application/octet-stream',
      defaultExtensao: 'bin',
      prefixo: 'documento'
    },
    {
      key: 'videoMessage',
      defaultMimetype: 'video/mp4',
      defaultExtensao: 'mp4',
      prefixo: 'video'
    },
    {
      key: 'audioMessage',
      defaultMimetype: 'audio/ogg',
      defaultExtensao: 'ogg',
      prefixo: 'audio'
    }
  ];

  for (const tipo of tiposArquivo) {
    const arquivo = messageData[tipo.key];
    if (arquivo?.url) {
      const mimetype = arquivo.mimetype || tipo.defaultMimetype;
      const extensao = mimetype.split('/')[1] || tipo.defaultExtensao;
      const fileName = arquivo.fileName || `${tipo.prefixo}_${Date.now()}.${extensao}`;

      return {
        url: arquivo.url,
        mimetype,
        fileName,
        caption: arquivo.caption,
        fileLength: arquivo.fileLength,
        mediaKey: arquivo.mediaKey,
        directPath: arquivo.directPath,
        messageId
      };
    }
  }

  return null;
};

export const extrairArquivoDoWebhook = (dados: any): ArquivoInfo | null => {
  // if (isMensagemDoBot(dados)) {
  //   console.log('[Download] Ignorando arquivo - mensagem do próprio bot (fromMe = true)');
  //   return null;
  // }
  
  if (!isMensagemDoUsuario(dados)) {
    console.log('[Download] Ignorando arquivo - não é mensagem do usuário');
    return null;
  }

  const conversation = dados?.data?.message?.conversation || '';
  if (temCaracteristicasDoBot(conversation)) {
    console.log('[Download] Ignorando arquivo - mensagem com características do bot');
    return null;
  }

  const messageData = dados?.data?.message;
  const messageId = dados?.data?.key?.id;

  return extrairArquivoDeMensagem(messageData, messageId);
}; 