import * as etapaService from './etapaService';
import * as mensagemService from './mensagemService';
import * as evolutionApiService from './evolutionApiService';
import { Mensagem } from '../interfaces/Mensagem';
import { Etapa } from '../interfaces/Etapa';

type Etapas = { [key: string]: string };

export const transferirParaHumano = async (
  telefone: string,
  conversaId: string,
  numeroDestino: string
): Promise<void> => {
  const nomesMenusPrincipais: { [key: string]: string } = {
    matriculas_menu: 'Matrículas',
    coordenacao_menu: 'Coordenação',
    financeiro_menu: 'Financeiro',
    documentacao_menu: 'Documentação',
    rh_menu: 'RH'
  };

  const telefoneFormatado = telefone.replace(/@s\.whatsapp\.net$/, '');

  // Ajuste para aceitar null e converter conversaId para number
  const etapasObj: Etapa | null = await etapaService.getEtapas(Number(conversaId));
  const mensagens: Mensagem[] = await mensagemService.getMensagens(Number(conversaId));

  // Converta Etapa para objeto de etapas (Etapas)
  const etapas: { [key: string]: string } = {};
  if (etapasObj) {
    Object.keys(etapasObj).forEach(key => {
      if (key.startsWith('etapa_')) {
        etapas[key] = etapasObj[key as keyof Etapa] as string;
      }
    });
  }

  const formatarEtapa = (etapa: string, index: number): string => {
    if (index === 0 && nomesMenusPrincipais[etapa]) {
      return nomesMenusPrincipais[etapa];
    }
    return etapa
      .replace(/^.*?_/, '') // remove prefixo
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const etapasFormatadas = Object.values(etapas)
    .filter(e => e && typeof e === 'string')
    .map((e, i) => `🔹 ${i === 0 ? 'Área' : `Menu ${i}`}: ${formatarEtapa(e, i)}`)
    .join('\n');

  const entradasUsuario = mensagens
    .filter(m => m.tipo === 'entrada')
    .map(m => `🗨️ ${m.mensagem}`)
    .join('\n');

  const mensagemTransferencia =
    `🤖 *Atendimento Virtual Finalizado*

📱 *Usuário:* ${telefoneFormatado}

🧭 *Caminho percorrido:*
${etapasFormatadas}

💬 *Mensagens enviadas pelo usuário:*
${entradasUsuario}

📨 *Encaminhado para atendimento humano.*`;

  await evolutionApiService.enviarMensagem(numeroDestino, mensagemTransferencia);
};
