import * as evolutionApiService from './evolutionApiService';
import * as etapaService from './etapaService';
import * as mensagemService from './mensagemService';
import * as minioService from './minioService';
import { Etapa } from '../interfaces/Etapa';
import { MensagemComArquivos } from '../interfaces/Mensagem';

const NOMES_MENUS_PRINCIPAIS: { [key: string]: string } = {
  matriculas_menu: 'Matrículas',
  coordenacao_menu: 'Coordenação',
  financeiro_menu: 'Financeiro',
  documentacao_menu: 'Documentação',
  rh_menu: 'RH'
};

const formatarTelefone = (telefone: string): string => {
  return telefone.replace(/@s\.whatsapp\.net$/, '');
};

const formatarEtapa = (etapa: string, index: number): string => {
  if (index === 0 && NOMES_MENUS_PRINCIPAIS[etapa]) {
    return NOMES_MENUS_PRINCIPAIS[etapa];
  }
  return etapa
    .replace(/^.*?_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const processarEtapas = (etapasObj: Etapa | null): string => {
  const etapas: { [key: string]: string } = {};
  
  if (etapasObj) {
    Object.keys(etapasObj).forEach(key => {
      if (key.startsWith('etapa_')) {
        etapas[key] = etapasObj[key as keyof Etapa] as string;
      }
    });
  }

  return Object.values(etapas)
    .filter(e => e && typeof e === 'string')
    .map((e, i) => `🔹 ${i === 0 ? 'Área' : `Menu ${i}`}: ${formatarEtapa(e, i)}`)
    .join('\n');
};

const processarMensagensUsuario = (mensagens: MensagemComArquivos[]): string => {
  return mensagens
    .filter(m => m.tipo === 'entrada')
    .map(m => {
      let texto = `🗨️ ${m.mensagem}`;
      if (m.arquivos && m.arquivos.length > 0) {
        texto += ` 📎 (${m.arquivos.length} arquivo${m.arquivos.length > 1 ? 's' : ''})`;
      }
      return texto;
    })
    .join('\n');
};

const criarMensagemTransferencia = (
  telefoneFormatado: string,
  etapasFormatadas: string,
  entradasUsuario: string
): string => {
  return `🤖 *Atendimento Virtual Finalizado*

📱 *Usuário:* ${telefoneFormatado}

🧭 *Caminho percorrido:*
${etapasFormatadas}

💬 *Mensagens enviadas pelo usuário:*
${entradasUsuario}

📨 *Encaminhado para atendimento humano.*`;
};

const processarArquivo = async (
  arquivo: any,
  index: number,
  numeroDestino: string,
  arquivosEnviados: Set<string>
): Promise<void> => {
  if (arquivosEnviados.has(arquivo.name)) {
    return;
  }

  if (!arquivo.buffer || arquivo.buffer.length === 0) {
    return;
  }

  if (!arquivo.contentType || arquivo.contentType === 'application/octet-stream') {
    return;
  }

  try {
    const base64 = arquivo.buffer.toString('base64');
    let mediatype = arquivo.contentType.split('/')[0];
    
    if (mediatype === 'application') {
      mediatype = 'document';
    }

    let nomeArquivo = arquivo.name;
    if (!nomeArquivo.includes('.')) {
      const extensao = arquivo.contentType.split('/')[1] || 'bin';
      nomeArquivo = `arquivo_${index + 1}.${extensao}`;
    }

    const payload = {
      mediatype,
      mimetype: arquivo.contentType,
      media: base64,
      fileName: nomeArquivo
    };

    await evolutionApiService.enviarArquivo(
      numeroDestino,
      payload,
      {
        caption: 'Arquivo enviado pelo usuário',
        delay: index === 0 ? 1000 : 2000
      }
    );

    arquivosEnviados.add(arquivo.name);
  } catch (error) {
    console.error(`[Transferência] Erro ao enviar arquivo ${arquivo.name}:`, error);
  }
};

const buscarArquivoMaisNovoMinio = async (): Promise<{ buffer: Buffer; nome: string; extensao: string; contentType: string } | null> => {
  try {
    // Buscar todos os arquivos do MinIO
    const todosArquivos = await minioService.listarArquivos();
    
    if (todosArquivos.length === 0) {
      console.log('[Transferência] Nenhum arquivo encontrado no MinIO');
      return null;
    }

    // Filtrar apenas arquivos com extensão
    const arquivosComExtensao = todosArquivos.filter(arquivo => {
      const extensao = arquivo.name.split('.').pop()?.toLowerCase();
      return extensao && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'mp3', 'wav', 'ogg', 'm4a', 'pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extensao);
    });

    if (arquivosComExtensao.length === 0) {
      console.log('[Transferência] Nenhum arquivo com extensão válida encontrado no MinIO');
      return null;
    }

    // Ordenar por data de modificação (mais novo primeiro)
    arquivosComExtensao.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    const arquivoMaisNovo = arquivosComExtensao[0];

    console.log(`[Transferência] Arquivo mais novo encontrado no MinIO: ${arquivoMaisNovo.name} (${arquivoMaisNovo.lastModified})`);

    // Baixar o conteúdo do arquivo
    const conteudo = await minioService.baixarArquivo(arquivoMaisNovo.name);
    if (!conteudo || conteudo.buffer.length === 0) {
      console.log('[Transferência] Erro ao baixar conteúdo do arquivo mais novo');
      return null;
    }

    const extensao = arquivoMaisNovo.name.split('.').pop()?.toLowerCase() || '';
    
    return {
      buffer: conteudo.buffer,
      nome: arquivoMaisNovo.name,
      extensao: extensao,
      contentType: conteudo.contentType
    };
  } catch (error) {
    console.error('[Transferência] Erro ao buscar arquivo mais novo no MinIO:', error);
    return null;
  }
};

const enviarArquivoEvolutionMedia = async (
  numeroDestino: string,
  arquivoInfo: { buffer: Buffer; nome: string; extensao: string; contentType: string }
): Promise<void> => {
  try {
    const base64 = arquivoInfo.buffer.toString('base64');
    
    // Determinar o tipo de mídia baseado na extensão
    let mediatype = 'document';
    let mimetype = arquivoInfo.contentType || 'application/octet-stream';
    
    const extensao = arquivoInfo.extensao.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extensao)) {
      mediatype = 'image';
      if (!mimetype.startsWith('image/')) {
        mimetype = `image/${extensao}`;
      }
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extensao)) {
      mediatype = 'video';
      if (!mimetype.startsWith('video/')) {
        mimetype = `video/${extensao}`;
      }
    } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extensao)) {
      mediatype = 'audio';
      if (!mimetype.startsWith('audio/')) {
        mimetype = `audio/${extensao}`;
      }
    } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extensao)) {
      mediatype = 'document';
      if (!mimetype.startsWith('application/')) {
        mimetype = `application/${extensao}`;
      }
    }

    const payload = {
      mediatype,
      mimetype,
      media: base64,
      fileName: arquivoInfo.nome
    };

    await evolutionApiService.enviarArquivo(
      numeroDestino,
      payload,
      {
        caption: 'Arquivo mais recente do sistema',
        delay: 1000
      }
    );

    console.log(`[Transferência] Arquivo MinIO enviado: ${arquivoInfo.nome}`);
  } catch (error) {
    console.error(`[Transferência] Erro ao enviar arquivo MinIO ${arquivoInfo.nome}:`, error);
  }
};

export const transferirParaHumano = async (
  telefone: string,
  conversaId: string,
  numeroDestino: string
): Promise<void> => {
  const telefoneFormatado = formatarTelefone(telefone);
  const conversaIdNum = Number(conversaId);

  const [etapasObj, mensagens, arquivosMinio] = await Promise.all([
    etapaService.getEtapas(conversaIdNum),
    mensagemService.getMensagensComArquivos(conversaIdNum),
    minioService.buscarArquivosMinioPorConversaApenasEntrada(conversaIdNum)
  ]);

  const arquivosParaEnviar = arquivosMinio.filter(arquivo => 
    arquivo.buffer && arquivo.buffer.length > 0
  );

  const etapasFormatadas = processarEtapas(etapasObj);
  const entradasUsuario = processarMensagensUsuario(mensagens);
  const mensagemTransferencia = criarMensagemTransferencia(
    telefoneFormatado,
    etapasFormatadas,
    entradasUsuario
  );

  await evolutionApiService.enviarMensagem(numeroDestino, mensagemTransferencia);

  // Buscar e enviar arquivo mais novo do MinIO
  const arquivoMaisNovo = await buscarArquivoMaisNovoMinio();
  
  if (arquivoMaisNovo) {
    await enviarArquivoEvolutionMedia(numeroDestino, arquivoMaisNovo);
  }

  if (arquivosParaEnviar.length > 0) {
    const arquivosEnviados = new Set<string>();
    
    for (let i = 0; i < arquivosParaEnviar.length; i++) {
      await processarArquivo(arquivosParaEnviar[i], i, numeroDestino, arquivosEnviados);
      
      if (i < arquivosParaEnviar.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
};
