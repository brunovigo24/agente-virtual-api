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
    .filter(m => m.tipo === 'entrada' && m.mensagem && m.mensagem.trim() !== '')
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
        caption: 'Arquivo enviado pelo usuário',
        delay: 1000
      }
    );
  } catch (error) {
    console.error(`[Transferência] Erro ao enviar última mídia do usuário ${arquivoInfo.nome}:`, error);
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

  const etapasFormatadas = processarEtapas(etapasObj);
  const entradasUsuario = processarMensagensUsuario(mensagens);

  const ultimaMidia = await minioService.buscarUltimaMidiaUsuario(telefone);

  let entradasUsuarioComMidia = entradasUsuario;
  if (ultimaMidia) {
    if (entradasUsuario.trim() !== '') {
      entradasUsuarioComMidia += '\n🗨️ 📎 *Arquivo enviado pelo usuário*';
    } else {
      entradasUsuarioComMidia = '🗨️ 📎 *Arquivo enviado pelo usuário*';
    }
  }

  const mensagemTransferencia = criarMensagemTransferencia(
    telefoneFormatado,
    etapasFormatadas,
    entradasUsuarioComMidia
  );

  await evolutionApiService.enviarMensagem(numeroDestino, mensagemTransferencia);

  // Enviar última mídia do usuário se existir
  if (ultimaMidia) {
    const extensao = ultimaMidia.name.split('.').pop()?.toLowerCase() || '';
    await enviarArquivoEvolutionMedia(numeroDestino, {
      buffer: ultimaMidia.buffer,
      nome: ultimaMidia.name,
      extensao: extensao,
      contentType: ultimaMidia.contentType
    });
  }

  try {
    await minioService.deletarArquivosPorConversa(conversaIdNum);
  } catch (error) {
    console.error(`[Transferência] Erro ao deletar arquivos do MinIO para conversa ${conversaIdNum}:`, error);
  }
};
