export interface AcaoArquivo {
  id?: number;
  acao_id: number;
  arquivo: Buffer;
  arquivo_nome: string;
  arquivo_tipo: string;
  ordem: number;
  criado_em?: Date;
}

export interface AcaoComArquivos {
  id: number;
  etapa: string;
  opcao: string;
  acao_tipo: string;
  conteudo: string;
  arquivos?: AcaoArquivo[];
} 