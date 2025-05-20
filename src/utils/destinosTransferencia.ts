import fs from 'fs';
import path from 'path';

const caminho = path.resolve(__dirname, '..', 'data', 'destinosTransferencia.json');
const conteudo = fs.readFileSync(caminho, 'utf-8');

const destinosTransferencia = JSON.parse(conteudo);
export default destinosTransferencia;
