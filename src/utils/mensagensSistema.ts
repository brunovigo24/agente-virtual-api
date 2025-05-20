import fs from 'fs';
import path from 'path';

const caminho = path.resolve(__dirname, '..', 'data', 'mensagensSistema.json');
const conteudo = fs.readFileSync(caminho, 'utf-8');

const mensagensSistema = JSON.parse(conteudo);
export default mensagensSistema;
