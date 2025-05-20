import fs from 'fs';
import path from 'path';

const caminho = path.resolve(__dirname, '..', 'data', 'menus.json');
const conteudo = fs.readFileSync(caminho, 'utf-8');

const menus = JSON.parse(conteudo);
export default menus;
