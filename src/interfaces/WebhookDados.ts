export interface WebhookDados {
  data?: {
    key?: {
      fromMe?: boolean;
      remoteJid?: string;
      remoteJidAlt?: string; // JID alternativo fornecido pela Evolution quando remoteJid vem como "@lid"
      id?: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      listResponseMessage?: {
        singleSelectReply?: {
          selectedRowId?: string;
        };
      };
      // Suporte para arquivos/imagens
      imageMessage?: {
        url?: string;
        mimetype?: string;
        caption?: string;
        fileLength?: string;
        height?: number;
        width?: number;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        jpegThumbnail?: string;
        contextInfo?: any;
      };
      documentMessage?: {
        url?: string;
        mimetype?: string;
        fileName?: string;
        fileLength?: string;
        pageCount?: number;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        contextInfo?: any;
      };
      videoMessage?: {
        url?: string;
        mimetype?: string;
        caption?: string;
        fileLength?: string;
        height?: number;
        width?: number;
        seconds?: number;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        jpegThumbnail?: string;
        contextInfo?: any;
      };
      audioMessage?: {
        url?: string;
        mimetype?: string;
        seconds?: number;
        ptt?: boolean;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        contextInfo?: any;
      };
    };
  };
  instance?: string;
} 