export interface AvaliarResultado {
  tipo: 'menu' | 'acao' | 'transferido_finalizado' | 'etapa_atualizada' | 'erro';
  menu?: any;
  mensagem?: string;
} 