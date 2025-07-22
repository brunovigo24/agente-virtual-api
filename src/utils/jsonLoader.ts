import fs from 'fs';
import path from 'path';

export const lerJson = (arquivo: string) => {
  const caminho = path.resolve(__dirname, '..', 'data', arquivo);
  
  // Força a limpeza de qualquer cache do sistema
  try {
    delete require.cache[caminho];
  } catch (e) {
  }
  
  const conteudo = fs.readFileSync(caminho, { encoding: 'utf-8', flag: 'r' });
  return JSON.parse(conteudo);
};

export const salvarJson = (arquivo: string, dados: any) => {
  const caminho = path.resolve(__dirname, '..', 'data', arquivo);
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
};
