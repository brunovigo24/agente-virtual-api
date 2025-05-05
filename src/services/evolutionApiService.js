const axios = require('axios');

const API_URL = process.env.EVOLUTION_API_URL || 'http://172.26.0.4:8080';
const API_KEY = process.env.EVOLUTION_API_KEY || 'E5D987D920E2-4663-91C5-BD4AF0965CED';
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'Desenvolvimento';

/**
 * Envia mensagem de texto simples seguindo boas práticas e exemplo fornecido
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
 * Envia menu em forma de lista usando fetch conforme documentação
 */
async function enviarMenuLista(telefone, titulo, descricao, opcoes, botao = 'Escolher opção', footer = '', delay = 1000) {
  const numeroLimpo = telefone.replace(/@s\.whatsapp\.net$/, '');
  const sections = [
    {
      title: titulo,
      rows: opcoes.map((item) => ({
        title: item.titulo,
        description: item.descricao || '',
        rowId: item.id
      }))
    }
  ];

  const payload = {
    number: numeroLimpo,
    title: titulo,
    description: descricao,
    buttonText: botao,
    footerText: footer,
    sections,
    delay
    // outros campos opcionais podem ser adicionados conforme necessário
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
    console.log('Menu lista enviado:', response.status, data);
    if (!response.ok) {
      throw new Error(`Erro ao enviar menu lista: ${response.status} - ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    console.error('Erro ao enviar menu lista:', {
      message: error.message
    });
    throw error;
  }
}

module.exports = {
  enviarMensagem,
  enviarMenuLista
};
