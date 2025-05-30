export interface WebhookDados {
  data?: {
    key?: {
      fromMe?: boolean;
      remoteJid?: string;
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
    };
  };
  instance?: string;
} 