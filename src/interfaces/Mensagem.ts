export interface Mensagem {
    id: number;
    conversa_id: number;
    mensagem: string;
    tipo: string; 
    data_hora: string; // ou Date
}
