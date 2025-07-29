export interface AvaliarResultado {
  tipo: 'menu' | 'acao' | 'transferido_finalizado' | 'etapa_atualizada' | 'erro' | 'finalizado' | 'aguardando_resposta';
  menu?: any;
  mensagem?: string;
  acao?: string;
} 