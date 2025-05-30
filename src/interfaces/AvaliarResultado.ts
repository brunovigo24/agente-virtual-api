export interface AvaliarResultado {
  tipo: 'menu' | 'acao' | 'transferido_finalizado' | 'etapa_atualizada' | 'erro' | 'finalizado';
  menu?: any;
  mensagem?: string;
  acao?: string;
} 