export interface Mensagem {
    id: number;
    conversa_id: number;
    mensagem: string;
    tipo: string; 
    data_hora: string; // ou Date
}

export interface MensagemComArquivos extends Mensagem {
    arquivos?: {
        buffer: Buffer;
        name: string;
        contentType: string;
        size: number;
    }[];
}
