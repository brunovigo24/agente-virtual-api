const fluxo = require('../utils/fluxoEtapas');
const conversaService = require('./conversaService');
const menus = require('../utils/menus');
const actionHandlers = require('../utils/actionHandlers');
const etapaService = require('./etapaService');
const transferenciaService = require('./transferenciaService');

exports.avaliar = async (etapaAtual, mensagem, conversa, telefone) => {
  let opcoes = fluxo.rotas[etapaAtual] || fluxo[etapaAtual];

  // Busca etapa exata ou wildcard "*"
  let proximaEtapa = opcoes?.[mensagem.trim()];
  if (!proximaEtapa && opcoes?.['*']) {
    proximaEtapa = opcoes['*'];
  }

  // Executa handler, mas NÃO retorna imediatamente
  if (actionHandlers[etapaAtual]?.[mensagem]) {
    await actionHandlers[etapaAtual][mensagem](telefone);
  }

  // Se encontrou próxima etapa, atualiza conversa e registra etapa
  if (proximaEtapa) {
    await conversaService.atualizarEtapa(conversa.id, proximaEtapa);
    await etapaService.registrarEtapa(conversa.id, proximaEtapa);

    // Redireciona para coleta_dafos se for wildcard
    if (proximaEtapa === 'coleta_dados') {
      // Isso força execução da lógica abaixo (sem return)
      etapaAtual = 'coleta_dados';
    } else {
      // Exibe menu, se houver
      const menuKey = proximaEtapa.replace(/_menu$/, 'Menu');
      if (menus[proximaEtapa]) {
        return { tipo: 'menu', menu: menus[proximaEtapa] };
      }
      if (menus[menuKey]) {
        return { tipo: 'menu', menu: menus[menuKey] };
      }
    }
  }

  // Lógica de coleta e transferência
  if (etapaAtual === 'coleta_dados') {
    await conversaService.atualizarEtapa(conversa.id, 'transferido_finalizado');
    await transferenciaService.transferirParaHumano(telefone, conversa.id, '5544988587535');
    return { tipo: 'transferido_finalizado' };
  }

  // Caso apenas ação foi executada, sem transição
  if (actionHandlers[etapaAtual]?.[mensagem]) {
    return { tipo: 'acao' };
  }

  return null; // Nenhuma opção válida encontrada
};
