require('dotenv').config();


const API_URL = process.env.EVOLUTION_API_URL 
const API_KEY = process.env.EVOLUTION_API_KEY 
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME 

/**
 * Envia mensagem de texto simples 
 */
async function enviarMensagem(telefone, texto) {
  const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');
  const payload = {
    instanceName: INSTANCE_NAME,
    number: numeroLimpo,
    delay: 1000,
    text: texto
  };

  const options = {
    method: 'POST',
    headers: {
      apikey: API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(`${API_URL}/message/sendText/${INSTANCE_NAME}`, options);
    const data = await response.json();
    console.log('Mensagem enviada:', response.status, data);
    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.status} - ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', {
      message: error.message
    });
    throw error;
  }
}

/**
 * Envia uma lista de opções (menu) para o usuário
 * @param {string} telefone - Número do destinatário
 * @param {object} menu - Objeto de menu (menus.menuPrincipal, menus.matriculasMenu, etc)
 */
async function enviarLista(telefone, menu, menuIds = {}) {
  const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');

  // Monta as opções (rows) a partir do menu recebido
  const rows = menu.opcoes.map(opcao => ({
    title: opcao.titulo,
    rowId: opcao.id  
  }));

  const payload = {
    instanceName: INSTANCE_NAME,
    number: numeroLimpo,
    title: menu.titulo,
    description: menu.descricao,
    buttonText: 'Selecionar',
    footerText: 'Selecione uma opção abaixo:',
    sections: [
      {
        title: menu.titulo,
        rows: rows
      }
    ],
    delay: 1000
  };

  const options = {
    method: 'POST',
    headers: {
      apikey: API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(`${API_URL}/message/sendList/${INSTANCE_NAME}`, options);
    const data = await response.json();
    console.log('Lista enviada:', response.status, data);
    if (!response.ok) {
      throw new Error(`Erro ao enviar lista: ${response.status} - ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error('Erro ao enviar lista:', {
      message: error.message
    });
    throw error;
  }
}

module.exports = {
  enviarMensagem,
  enviarLista
};
