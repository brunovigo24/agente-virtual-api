const mensagensSistema = require('../utils/mensagensSistema'); 

module.exports = {
    menu_principal: {
      titulo: 'Menu Principal',
      descricao: mensagensSistema.menuPrincipal,
      opcoes: [
        { id: '1', titulo: 'Matrículas' },
        { id: '2', titulo: 'Coordenação' },
        { id: '3', titulo: 'Financeiro' },
        { id: '4', titulo: 'Documentação' },
        { id: '5', titulo: 'RH' }
      ]
    },
    matriculas_menu: {
      titulo: 'Matrículas',
      descricao: mensagensSistema.matriculasMenu,
      opcoes: [
        { id: '1', titulo: 'Educação Infantil' },
        { id: '2', titulo: 'Anos Iniciais' },
        { id: '3', titulo: 'Anos Finais' },
        { id: '4', titulo: 'Ensino Médio' }
      ]
    },
    coordenacao_menu: {
      titulo: 'Coordenação',
      descricao: mensagensSistema.coordenacaoMenu,
      opcoes: [
        { id: '1', titulo: 'Educação Infantil Zona 5' },
        { id: '2', titulo: 'Educação Infantil Santos Dumount' },
        { id: '3', titulo: 'Anos Iniciais' },
        { id: '4', titulo: 'Anos Finais' },
        { id: '5', titulo: 'Ensino médio' }
      ]
    },
    financeiro_menu: {
      titulo: 'Financeiro',
      descricao: mensagensSistema.financeiroMenu,
      opcoes: [
        { id: '1', titulo: '2ª Via de Boleto' },
        { id: '2', titulo: 'Negociar valores em aberto' },
        { id: '3', titulo: 'Solicitar cópia de contrato' },
        { id: '4', titulo: 'Declaração de IRRF 2024' },
        { id: '5', titulo: 'Cancelamentos' }
      ]
    },
    documentacao_menu: {
      titulo: 'Documentação',
      descricao: mensagensSistema.documentacaoMenu,
      opcoes: [
        { id: '1', titulo: 'Declaração de mátricula' },
        { id: '2', titulo: 'Transferência' },
        { id: '3', titulo: 'Histórico Escolar' }
      ]
    },
    rh_menu: {
      titulo: 'RH',
      descricao: mensagensSistema.rhMenu,
      opcoes: [
        { id: '1', titulo: 'Quero enviar meu currículo' },
        { id: '2', titulo: 'Status de processo seletivo' },
        { id: '3', titulo: 'Já sou funcionário' }
      ]
    },
    matriculas_infantil: {
      titulo: 'Educação Infantil',
      descricao: mensagensSistema.matriculasInfantilMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar vídeo institucional' },
        { id: '3', titulo: 'Solicitar mais informações' }
      ]
    },
    matriculas_anos_iniciais: {
      titulo: 'Anos Iniciais',
      descricao: mensagensSistema.matriculasAnosIniciaisMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar mais informações' }
      ]
    },
    matriculas_anos_finais: {
      titulo: 'Anos Finais',
      descricao: mensagensSistema.matriculasAnosFinaisMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar mais informações' }
      ]
    },
    matriculas_ensino_medio: {
      titulo: 'Ensino Médio',
      descricao: mensagensSistema.matriculasEnsinoMedioMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar mais informações' }
      ]
    }
};
