const axios = require('axios');

const API_URL = process.env.EVOLUTION_API_URL || 'http://172.26.0.4:8080';
const API_KEY = process.env.EVOLUTION_API_KEY || 'E5D987D920E2-4663-91C5-BD4AF0965CED';
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'Desenvolvimento';

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
 */
async function enviarLista(telefone) {
  const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');

  // Menu principal fixo conforme menus.js
  const menuPrincipal = {
    titulo: 'Menu Principal',
    descricao: 'Escolha uma opção para continuar:',
    opcoes: [
      { id: '1', titulo: 'Matrículas' },
      { id: '2', titulo: 'Coordenação' },
      { id: '3', titulo: 'Financeiro' },
      { id: '4', titulo: 'Documentação' },
      { id: '5', titulo: 'RH' }
    ]
  };

  // Mapeamento dos ids para cada opção do menu principal
  const menuIds = {
    '1': 'matriculas_menu',
    '2': 'coordenacao_menu',
    '3': 'financeiro_menu',
    '4': 'documentacao_menu',
    '5': 'rh_menu'
  };

  // Monta as opções (rows) a partir do menu principal
  const rows = menuPrincipal.opcoes.map(opcao => ({
    title: opcao.titulo,
    rowId: menuIds[opcao.id] || opcao.id
  }));

  const payload = {
    instanceName: INSTANCE_NAME,
    number: numeroLimpo,
    title: menuPrincipal.titulo,
    description: menuPrincipal.descricao,
    buttonText: 'Selecionar',
    footerText: 'Selecione uma opção abaixo:',
    sections: [
      {
        title: menuPrincipal.titulo,
        rows: rows
      }
    ],
    delay: 1000
    // Adicione outros campos se necessário
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
