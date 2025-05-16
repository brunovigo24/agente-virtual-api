const API_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME;

/**
 * Envia mensagem de texto simples 
 */
export async function enviarMensagem(telefone: string, texto: string): Promise<any> {
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
      apikey: API_KEY as string,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const fetch = (...args: [any, any?]) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(`${API_URL}/message/sendText/${INSTANCE_NAME}`, options);
    const data = await response.json();
    console.log('Mensagem enviada:', response.status, data);
    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.status} - ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', {
      message: error.message
    });
    throw error;
  }
}

/**
 * Envia uma lista de opções (menu) para o usuário
 * @param telefone - Número do destinatário
 * @param menu - Objeto de menu (menus.menuPrincipal, menus.matriculasMenu, etc)
 */
export async function enviarLista(
  telefone: string,
  menu: { titulo: string; descricao: string; opcoes: Array<{ titulo: string; id: string }> },
  menuIds: Record<string, any> = {}
): Promise<any> {
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
      apikey: API_KEY as string,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const fetch = (...args: [any, any?]) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const response = await fetch(`${API_URL}/message/sendList/${INSTANCE_NAME}`, options);
    const data = await response.json();
    console.log('Lista enviada:', response.status, data);
    if (!response.ok) {
      throw new Error(`Erro ao enviar lista: ${response.status} - ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error: any) {
    console.error('Erro ao enviar lista:', {
      message: error.message
    });
    throw error;
  }
}
