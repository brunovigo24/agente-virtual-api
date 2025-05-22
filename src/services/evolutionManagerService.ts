const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || '';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';

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
    syncFullHistory: true,
    webhook: {
      url: process.env.WEBHOOK_URL || 'http://localhost:3000/webhook/whatsapp',
      byEvents: true,
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

  if (!response.ok) {
    const erro = await response.json();
    const errorMessage =
      (erro && typeof erro === 'object' && 'response' in erro && erro.response && typeof erro.response === 'object' && 'message' in erro.response)
        ? (erro as any).response.message
        : response.statusText;
    throw new Error(`Erro ao criar instância: ${errorMessage}`);
  }

  const data = await response.json();
  return data;
};
