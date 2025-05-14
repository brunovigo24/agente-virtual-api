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
        { id: '5', titulo: 'RH' },
        { id: '0', titulo: 'Encerrar atendimento' }
      ]
    },
    matriculas_menu: {
      titulo: 'Matrículas',
      descricao: mensagensSistema.matriculasMenu,
      opcoes: [
        { id: '1', titulo: 'Educação Infantil' },
        { id: '2', titulo: 'Anos Iniciais' },
        { id: '3', titulo: 'Anos Finais' },
        { id: '4', titulo: 'Ensino Médio' },
        { id: '#', titulo: '↩️ Voltar' }
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
        { id: '5', titulo: 'Ensino médio' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    coordenacao_infantil_zona5: {
      titulo: 'Educação Infantil Zona 5',
      descricao: mensagensSistema.coordenacaoInfantilZona5Menu,
      opcoes: [
        { id: '1', titulo: 'Calendário Escolar 2025' },
        { id: '2', titulo: 'Horário de aula' },
        { id: '3', titulo: 'Cronograma - Tarefa de casa' },
        { id: '4', titulo: 'Horário de alimentação' },
        { id: '5', titulo: 'Senha de acesso do app da Perto' },
        { id: '6', titulo: 'Eventos' },
        { id: '7', titulo: 'Cronograma de aulas extras' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    coordenacao_infantil_santos_dumount: {
      titulo: 'Educação Infantil Santos Dumount',
      descricao: mensagensSistema.coordenacaoInfantilSantosDumountMenu,
      opcoes: [
        { id: '1', titulo: 'Calendário Escolar 2025' },
        { id: '2', titulo: 'Horário de aula' },
        { id: '3', titulo: 'Cronograma - Tarefa de casa' },
        { id: '4', titulo: 'Horário de alimentação' },
        { id: '5', titulo: 'Senha de acesso do app da Perto' },
        { id: '6', titulo: 'Eventos' },
        { id: '7', titulo: 'Cronograma de aulas extras' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    coordenacao_anos_iniciais: {
      titulo: 'Anos Iniciais',
      descricao: mensagensSistema.coordenacaoAnosIniciaisMenu,
      opcoes: [
        { id: '1', titulo: 'Calendário Escolar 2025' },
        { id: '2', titulo: 'Horário de aula' },
        { id: '3', titulo: 'Cronograma de prova' },
        { id: '4', titulo: 'Recuperação' },
        { id: '5', titulo: '2° Chamada' },
        { id: '6', titulo: 'Eventos' },
        { id: '7', titulo: 'Passeios externos' },
        { id: '8', titulo: 'Outros assuntos' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    coordenacao_anos_finais: {
      titulo: 'Anos Finais',
      descricao: mensagensSistema.coordenacaoAnosFinaisMenu,
      opcoes: [
        { id: '1', titulo: 'Calendário Escolar 2025' },
        { id: '2', titulo: 'Horário de aula' },
        { id: '3', titulo: 'Cronograma de prova' },
        { id: '4', titulo: 'Recuperação' },
        { id: '5', titulo: '2° Chamada' },
        { id: '6', titulo: 'Eventos' },
        { id: '7', titulo: 'Passeios externos' },
        { id: '8', titulo: 'Outros assuntos' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    coordenacao_ensino_medio: {
      titulo: 'Ensino Médio',
      descricao: mensagensSistema.coordenacaoEnsinoMedioMenu,
      opcoes: [
        { id: '1', titulo: 'Calendário Escolar' },
        { id: '2', titulo: 'Horário de aula' },
        { id: '3', titulo: 'Cronograma de prova' },
        { id: '4', titulo: 'Recuperação' },
        { id: '5', titulo: '2° Chamada' },
        { id: '6', titulo: 'Notas parciais' },
        { id: '7', titulo: 'Agendamentos Coordenação/Professores' },
        { id: '8', titulo: 'Boletim Trimestral ' },
        { id: '9', titulo: 'Cursinho' },
        { id: '10', titulo: 'Outros assuntos' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    coordenacao_ensino_medio_cursinho: {
      titulo: 'Cursinho',
      descricao: mensagensSistema.coordenacaoEnsinoMedioCursinhoMenu,
      opcoes: [
        { id: '1', titulo: 'Quero me matricular' },
        { id: '2', titulo: 'Informações' },
        { id: '#', titulo: '↩️ Voltar' }
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
        { id: '5', titulo: 'Cancelamentos' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    financeiro_cancelamentos: {
      titulo: 'Cancelamentos',
      descricao: mensagensSistema.financeiroCancelamentosMenu,
      opcoes: [
        { id: '1', titulo: 'Período integral' },
        { id: '2', titulo: 'Matrícula total' },
        { id: '3', titulo: 'Extras curriculares' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    financeiro_cancelamentos_extras_curriculares: {
      titulo: 'Extras curriculares',
      descricao: mensagensSistema.financeiroExtrasCurricularesMenu,
      opcoes: [
        { id: '1', titulo: 'Basquete' },
        { id: '2', titulo: 'Futsal' },
        { id: '3', titulo: 'Vôlei' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },

    documentacao_menu: {
      titulo: 'Documentação',
      descricao: mensagensSistema.documentacaoMenu,
      opcoes: [
        { id: '1', titulo: 'Declaração de mátricula' },
        { id: '2', titulo: 'Transferência' },
        { id: '3', titulo: 'Histórico Escolar' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    documentacao_transferencia: {
      titulo: 'Transferência',
      descricao: mensagensSistema.documentacaoTransferenciaMenu,
      opcoes: [
        { id: '1', titulo: 'Solicitar 1ª via' },
        { id: '2', titulo: 'Solicitar 2ª via' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    documentacao_historico_escolar: {
      titulo: 'Histórico Escolar',
      descricao: mensagensSistema.documentacaoHistoricoEscolarMenu,
      opcoes: [
        { id: '1', titulo: 'Solicitar 1ª via' },
        { id: '2', titulo: 'Solicitar 2ª via' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },

    rh_menu: {
      titulo: 'RH',
      descricao: mensagensSistema.rhMenu,
      opcoes: [
        { id: '1', titulo: 'Quero enviar meu currículo' },
        { id: '2', titulo: 'Status de processo seletivo' },
        { id: '3', titulo: 'Já sou funcionário' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    rh_sou_funcionario: {
      titulo: 'Já sou funcionário',
      descricao: mensagensSistema.rhSouFuncionarioMenu,
      opcoes: [
        { id: '1', titulo: 'Solicitar Holerite' },
        { id: '2', titulo: 'Banco de horas' },
        { id: '3', titulo: 'Defeito no relógio ponto' },
        { id: '4', titulo: 'Outros assuntos' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    matriculas_infantil: {
      titulo: 'Educação Infantil',
      descricao: mensagensSistema.matriculasInfantilMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar vídeo institucional' },
        { id: '3', titulo: 'Solicitar mais informações' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    matriculas_anos_iniciais: {
      titulo: 'Anos Iniciais',
      descricao: mensagensSistema.matriculasAnosIniciaisMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar mais informações' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    matriculas_anos_finais: {
      titulo: 'Anos Finais',
      descricao: mensagensSistema.matriculasAnosFinaisMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar mais informações' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    },
    matriculas_ensino_medio: {
      titulo: 'Ensino Médio',
      descricao: mensagensSistema.matriculasEnsinoMedioMenu,
      opcoes: [
        { id: '1', titulo: 'Agendar visita' },
        { id: '2', titulo: 'Solicitar mais informações' },
        { id: '#', titulo: '↩️ Voltar' }
      ]
    }
};
