const mensagensSistema = require('../utils/mensagensSistema'); 

module.exports = {
    menuPrincipal: {
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
    matriculasMenu: {
      titulo: 'Matrículas',
      descricao: mensagensSistema.matriculasMenu,
      opcoes: [
        { id: '1', titulo: 'Educação Infantil' },
        { id: '2', titulo: 'Anos Iniciais' },
        { id: '3', titulo: 'Anos Finais' },
        { id: '4', titulo: 'Ensino Médio' }
      ]
    },
    coordenacaoMenu: {
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
    financeiroMenu: {
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
    documentacaoMenu: {
      titulo: 'Documentação',
      descricao: mensagensSistema.documentacaoMenu,
      opcoes: [
        { id: '1', titulo: 'Declaração de mátricula' },
        { id: '2', titulo: 'Transferência' },
        { id: '3', titulo: 'Histórico Escolar' }
      ]
    },
    rhMenu: {
      titulo: 'RH',
      descricao: mensagensSistema.rhMenu,
      opcoes: [
        { id: '1', titulo: 'Quero enviar meu currículo' },
        { id: '2', titulo: 'Status de processo seletivo' },
        { id: '3', titulo: 'Já sou funcionário' }
      ]
    }
};
