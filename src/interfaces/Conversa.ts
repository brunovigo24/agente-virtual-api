export interface Conversa {
  id: number;
  id_cliente: number;
  inicio_em: string; // ou Date
  fim_em: string | null;
  etapa_atual: string;
  ultima_interacao: string; // ou Date
}
