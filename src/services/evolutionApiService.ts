import axios from 'axios';
import { buscarInstanciaAtiva, buscarInstanciaPorNome } from './evolutionInstanceService';

const API_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";

/**
 * Envia mensagem de texto simples 
 */
export async function enviarMensagem(telefone: string, texto: string, instanceName?: string): Promise<any> {
  // Buscar instância ativa se não especificada
  let instancia;
  if (instanceName) {
    instancia = await buscarInstanciaPorNome(instanceName);
  } else {
    instancia = await buscarInstanciaAtiva();
  }

  if (!instancia) {
    throw new Error('Nenhuma instância ativa encontrada no banco de dados');
  }

  const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');
  const payload = {
    instanceName: instancia.instance_name,
    number: numeroLimpo,
    delay: 1000,
    text: texto
  };

  try {
    const response = await axios.post(
      `${API_URL}/message/sendText/${instancia.instance_name}`,
      payload,
      {
        headers: {
          apikey: instancia.hash,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('[Evolution] Erro ao enviar mensagem:', error.message);
    throw error;
  }
}

/**
 * Envia uma lista de opções (menu) para o usuário
 * Utiliza mensagens de texto formatadas para máxima compatibilidade
 * @param telefone - Número do destinatário
 * @param menu - Objeto de menu (menus.menuPrincipal, menus.matriculasMenu, etc)
 */
export async function enviarLista(
  telefone: string,
  menu: { titulo: string; descricao: string; opcoes: Array<{ titulo: string; id: string }> },
  menuIds: Record<string, any> = {},
  instanceName?: string
): Promise<any> {
  // Buscar instância ativa se não especificada
  let instancia;
  if (instanceName) {
    instancia = await buscarInstanciaPorNome(instanceName);
  } else {
    instancia = await buscarInstanciaAtiva();
  }

  if (!instancia) {
    throw new Error('Nenhuma instância ativa encontrada no banco de dados');
  }

  // Formata o menu como texto
  let textoMenu = `*${menu.titulo}*\n\n${menu.descricao}\n\n`;
  
  menu.opcoes.forEach(opcao => {
    textoMenu += `*${opcao.id}* - ${opcao.titulo}\n`;
  });
  
  textoMenu += `\n_Digite o número da opção desejada._`;

  // Envia como mensagem de texto simples
  return await enviarMensagem(telefone, textoMenu, instanceName);
}

/**
 * Envia um arquivo (mídia) para o usuário
 * @param telefone - Número do destinatário
 * @param arquivo - Objeto contendo os dados do arquivo
 * @param opcoes - Opções adicionais (caption, delay, etc)
 */
export async function enviarArquivo(
  telefone: string,
  arquivo: {
    mediatype: string; // ex: 'image', 'video', 'audio', 'document'
    mimetype: string; // ex: 'image/png', 'video/mp4', etc
    media: string; // base64 string
    fileName: string;
  },
  opcoes?: {
    caption?: string;
    delay?: number;
    linkPreview?: boolean;
    mentionsEveryOne?: boolean;
    mentioned?: string[];
    quoted?: any;
    instanceName?: string;
  }
): Promise<any> {
  // Buscar instância ativa se não especificada
  let instancia;
  if (opcoes?.instanceName) {
    instancia = await buscarInstanciaPorNome(opcoes.instanceName);
  } else {
    instancia = await buscarInstanciaAtiva();
  }

  if (!instancia) {
    throw new Error('Nenhuma instância ativa encontrada no banco de dados');
  }

  const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');
  const payload: any = {
    instanceName: instancia.instance_name,
    number: numeroLimpo,
    mediatype: arquivo.mediatype,
    mimetype: arquivo.mimetype,
    caption: opcoes?.caption,
    media: arquivo.media,
    fileName: arquivo.fileName,
    delay: opcoes?.delay ?? 1000,
    linkPreview: opcoes?.linkPreview,
    mentionsEveryOne: opcoes?.mentionsEveryOne,
    mentioned: opcoes?.mentioned,
    quoted: opcoes?.quoted
  };

  // Remove campos undefined
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

  try {
    const response = await axios.post(
      `${API_URL}/message/sendMedia/${instancia.instance_name}`,
      payload,
      {
        headers: {
          apikey: instancia.hash,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('[Evolution] Erro ao enviar arquivo:', error.message);
    throw error;
  }
}
