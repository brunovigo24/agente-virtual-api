import { salvarInstancia, removerInstancia } from './evolutionInstanceService';
import { EvolutionCreateResponse } from '../interfaces/EvolutionInstance';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/webhook/whatsapp';

//console.log('url:' + EVOLUTION_API_URL, 'key' + EVOLUTION_API_KEY);

export const criarInstancia = async (nome: string, numero: string) => {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    throw new Error('EVOLUTION_API_URL ou EVOLUTION_API_KEY não configurados.');
  }

  const body = {
    instanceName: nome,
    number: numero,
    qrcode: true,
    integration: 'WHATSAPP-BAILEYS',
    rejectCall: true,
    msgCall: 'Não aceitamos chamadas',
    groupsIgnore: true,
    alwaysOnline: true,
    readMessages: true,
    readStatus: true,
    syncFullHistory: false, // Desabilita sincronização de histórico completo
    webhook: {
      url: WEBHOOK_URL,
      byEvents: false,
      base64: true,
      headers: {
        authorization: EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
      },
      events: ['MESSAGES_UPSERT']
    }
  };

  const response = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
    method: 'POST',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  //console.log(`${EVOLUTION_API_URL}/instance/create`);
  //console.log(body);
  //console.log(response);

  if (!response.ok) {
    const erro = await response.json();
    const errorMessage =
      (erro && typeof erro === 'object' && 'response' in erro && erro.response && typeof erro.response === 'object' && 'message' in erro.response)
        ? (erro as any).response.message
        : response.statusText;
    throw new Error(`Erro ao criar instância: ${errorMessage}`);
  }

  const data: EvolutionCreateResponse = await response.json();
  
  // Salvar a instância no banco de dados
  try {
    await salvarInstancia({
      instance_name: data.instance.instanceName,
      instance_id: data.instance.instanceId,
      hash: data.hash,
      status: data.instance.status,
      webhook_url: body.webhook.url
    });
    
  } catch (dbError) {
    console.error('❌ Erro ao salvar instância no banco:', dbError);
  }
  
  return data;
};

export const gerarQR = async (instanceName: string) => {
  const url = `${EVOLUTION_API_URL}/instance/connect/${instanceName}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao gerar QR Code');
  }

  return data;
};

export const gerarPairing = async (instanceName: string) => {
  const url = `${EVOLUTION_API_URL}/instance/connect/${instanceName}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();

  console.log('🔍 Resposta da Evolution API:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao gerar código de pareamento');
  }

  return {
    instance: data.instance?.instanceName || null,
    pairingCode: data.qrcode?.pairingCode || null,
    status: data.instance?.status || null
  };
};
//Evolution API está retornando 200 OK mas com body null, aguardar correção do problema
//{
//     "instance": null,
//     "pairingCode": null,
//     "status": null
// }

export const statusInstancia = async (instanceName: string) => {
  const url = `${EVOLUTION_API_URL}/instance/connectionState/${instanceName}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao obter status da instância');
  }

  return {
    instance: instanceName,
    status: data?.status || 'desconhecido'
  };
};

export const fetchAllInstancias = async () => {
  const url = `${EVOLUTION_API_URL}/instance/fetchInstances`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  console.log(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao buscar instâncias');
  }

  return data;
};

export const deleteInstancia = async (instanceName: string) => {
  const url = `${EVOLUTION_API_URL}/instance/delete/${instanceName}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao deletar instância');
  }

  // Remover do banco de dados também
  try {
    await removerInstancia(instanceName);
  } catch (dbError) {
    console.error('❌ Erro ao remover instância do banco:', dbError);
  }

  return data;
};

export const logoutInstancia = async (instanceName: string) => {
  const url = `${EVOLUTION_API_URL}/instance/logout/${instanceName}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao realizar logout da instância');
  }

  return data;
};

export const restartInstancia = async (instanceName: string) => {
  const url = `${EVOLUTION_API_URL}/instance/restart/${instanceName}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      apikey: EVOLUTION_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao reiniciar a instância');
  }

  return data;
};