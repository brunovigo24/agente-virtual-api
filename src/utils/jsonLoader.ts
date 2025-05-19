import fs from 'fs';
import path from 'path';

export const lerJson = (arquivo: string) => {
  const caminho = path.resolve(__dirname, '..', 'data', arquivo);
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  return JSON.parse(conteudo);
};

export const salvarJson = (arquivo: string, dados: any) => {
  const caminho = path.resolve(__dirname, '..', 'data', arquivo);
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
};
