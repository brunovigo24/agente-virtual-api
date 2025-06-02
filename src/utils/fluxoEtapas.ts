export const etapasDeEncaminhamentoDireto = [
    'rh_outros_assuntos',
    'matriculas_infantil_agendar_visita',
    'matriculas_infantil_solicitar_video',
    'matriculas_infantil_solicitar_mais_informacoes',
    'matriculas_anos_iniciais_agendar_visita',
    'matriculas_anos_iniciais_solicitar_mais_informacoes',
    'matriculas_anos_finais_agendar_visita',
    'matriculas_anos_finais_solicitar_mais_informacoes',
    'matriculas_ensino_medio_agendar_visita',
    'matriculas_ensino_medio_solicitar_mais_informacoes',
    'coordenacao_zona5_calendario',
    'coordenacao_zona5_horario_aula',
    'coordenacao_zona5_cronograma',
    'coordenacao_zona5_horario_alimentacao',
    'coordenacao_zona5_senha',
    'coordenacao_zona5_eventos',
    'coordenacao_zona5_cronograma_extras',
    'coordenacao_santos_dumount_calendario',
    'coordenacao_santos_dumount_horario_aula',
    'coordenacao_santos_dumount_cronograma',
    'coordenacao_santos_dumount_horario_alimentacao',
    'coordenacao_santos_dumount_senha',
    'coordenacao_santos_dumount_eventos',
    'coordenacao_santos_dumount_cronograma_extras',
    'coordenacao_anos_iniciais_calendario',
    'coordenacao_anos_iniciais_horario_aula',
    'coordenacao_anos_iniciais_cronograma',
    'coordenacao_anos_iniciais_recuperacao',
    'coordenacao_anos_segunda_chamada',
    'coordenacao_anos_iniciais_eventos',
    'coordenacao_anos_iniciais_passeios_exeternos',
    'coordenacao_anos_iniciais_outros_assuntos',
    'coordenacao_anos_finais_calendario',
    'coordenacao_anos_finais_horario_aula',
    'coordenacao_anos_finais_cronograma',
    'coordenacao_anos_finais_recuperacao',
    'coordenacao_anos_finais_segunda_chamada',
    'coordenacao_anos_finais_eventos',
    'coordenacao_anos_finais_passeios_exeternos',
    'coordenacao_anos_finais_outros_assuntos',
    'coordenacao_ensino_medio_calendario',
    'coordenacao_ensino_medio_horario_aula',
    'coordenacao_ensino_medio_cronograma',
    'coordenacao_ensino_medio_recuperacao',
    'coordenacao_ensino_medio_segunda_chamada',
    'coordenacao_ensino_medio_notas_parciais', 
    'coordenacao_ensino_medio_agendamentos',
    'coordenacao_ensino_medio_boletim',
    'coordenacao_ensino_medio_outros_assuntos',
    'coordenacao_ensino_medio_cursinho_matricula',
    'coordenacao_ensino_medio_cursinho_informacoes',
];

export const rotas = {
    menu_principal: {
        '1': 'matriculas_menu',
        '2': 'coordenacao_menu',
        '3': 'financeiro_menu',
        '4': 'documentacao_menu',
        '5': 'rh_menu',
        '0': 'encerrar_atendimento'
    }
};

export const fluxoEtapas = {
    etapasDeEncaminhamentoDireto,
    rotas,
    matriculas_menu: {
        '1': 'matriculas_infantil',
        '2': 'matriculas_anos_iniciais',
        '3': 'matriculas_anos_finais',
        '4': 'matriculas_ensino_medio',
    },
        matriculas_infantil: {
            '1': 'matriculas_infantil_agendar_visita',
            '2': 'matriculas_infantil_solicitar_video',
            '3': 'matriculas_infantil_solicitar_mais_informacoes'
        },

        matriculas_anos_iniciais: {
            '1': 'matriculas_anos_iniciais_agendar_visita',
            '2': 'matriculas_anos_iniciais_solicitar_mais_informacoes'
        },

        matriculas_anos_finais: {
            '1': 'matriculas_anos_finais_agendar_visita',
            '2': 'matriculas_anos_finais_solicitar_mais_informacoes'
        },

        matriculas_ensino_medio: {
            '1': 'matriculas_ensino_medio_agendar_visita',
            '2': 'matriculas_ensino_medio_solicitar_mais_informacoes'
        },

    coordenacao_menu: {
        '1': 'coordenacao_infantil_zona5',
        '2': 'coordenacao_infantil_santos_dumount',
        '3': 'coordenacao_anos_iniciais',
        '4': 'coordenacao_anos_finais',
        '5': 'coordenacao_ensino_medio',
    },
        coordenacao_infantil_zona5: {
            '1': 'coordenacao_zona5_calendario',
            '2': 'coordenacao_zona5_horario_aula',
            '3': 'coordenacao_zona5_cronograma',
            '4': 'coordenacao_zona5_horario_alimentacao',
            '5': 'coordenacao_zona5_senha',
            '6': 'coordenacao_zona5_eventos',
            '7': 'coordenacao_zona5_cronograma_extras',
        },
        coordenacao_infantil_santos_dumount: {
            '1': 'coordenacao_santos_dumount_calendario',
            '2': 'coordenacao_santos_dumount_horario_aula',
            '3': 'coordenacao_santos_dumount_cronograma',
            '4': 'coordenacao_santos_dumount_horario_alimentacao',
            '5': 'coordenacao_santos_dumount_senha',
            '6': 'coordenacao_santos_dumount_eventos',
            '7': 'coordenacao_santos_dumount_cronograma_extras',
        },
        coordenacao_anos_iniciais: {    
            '1': 'coordenacao_anos_iniciais_calendario',
            '2': 'coordenacao_anos_iniciais_horario_aula',
            '3': 'coordenacao_anos_iniciais_cronograma',
            '4': 'coordenacao_anos_iniciais_recuperacao',
            '5': 'coordenacao_anos_segunda_chamada',
            '6': 'coordenacao_anos_iniciais_eventos',
            '7': 'coordenacao_anos_iniciais_passeios_exeternos',
            '8': 'coordenacao_anos_iniciais_outros_assuntos',
        },
        coordenacao_anos_finais: {
            '1': 'coordenacao_anos_finais_calendario',
            '2': 'coordenacao_anos_finais_horario_aula',
            '3': 'coordenacao_anos_finais_cronograma',
            '4': 'coordenacao_anos_finais_recuperacao',
            '5': 'coordenacao_anos_finais_segunda_chamada',
            '6': 'coordenacao_anos_finais_eventos',
            '7': 'coordenacao_anos_finais_passeios_exeternos',
            '8': 'coordenacao_anos_finais_outros_assuntos',
        },
        coordenacao_ensino_medio: {
            '1': 'coordenacao_ensino_medio_calendario',
            '2': 'coordenacao_ensino_medio_horario_aula',
            '3': 'coordenacao_ensino_medio_cronograma',
            '4': 'coordenacao_ensino_medio_recuperacao',
            '5': 'coordenacao_ensino_medio_segunda_chamada',
            '6': 'coordenacao_ensino_medio_notas_parciais',
            '7': 'coordenacao_ensino_medio_agendamentos',
            '8': 'coordenacao_ensino_medio_boletim',
            '9': 'coordenacao_ensino_medio_cursinho',
            '10': 'coordenacao_ensino_medio_outros_assuntos',
        },
        coordenacao_ensino_medio_cursinho: {
            '1': 'coordenacao_ensino_medio_cursinho_matricula',
            '2': 'coordenacao_ensino_medio_cursinho_informacoes',
        },


    financeiro_menu: {
        '1': 'financeiro_2via_boleto',
        '2': 'financeiro_negociar_valores',
        '3': 'financeiro_copia_contrato',
        '4': 'financeiro_irrf_2024',
        '5': 'financeiro_cancelamentos',
    },
        financeiro_2via_boleto: {
            '*': 'coleta_dados'
        },
        financeiro_negociar_valores: {
            '*': 'coleta_dados'
        },
        financeiro_copia_contrato: {
            '*': 'coleta_dados'
        },
        financeiro_irrf_2024: {
            '*': 'coleta_dados'
        },
        financeiro_cancelamentos: {
            '1': 'financeiro_cancelamentos_periodo_integral',
            '2': 'financeiro_cancelamentos_matricula_total',
            '3': 'financeiro_cancelamentos_extras_curriculares', 
        },
        financeiro_cancelamentos_periodo_integral: {
            '*': 'coleta_dados'
        },
        financeiro_cancelamentos_matricula_total: {
            '*': 'coleta_dados'
        },

            financeiro_cancelamentos_extras_curriculares: {
                '1': 'financeiro_extras_curriculares_basquete',
                '2': 'financeiro_extras_curriculares_futsal',
                '3': 'financeiro_extras_curriculares_volei',
            },
            financeiro_extras_curriculares_basquete: {
                '*': 'coleta_dados'
            },
            financeiro_extras_curriculares_futsal: {
                '*': 'coleta_dados'
            },
            financeiro_extras_curriculares_volei: {
                '*': 'coleta_dados'
            },

    documentacao_menu: {
        '1': 'documentacao_declaracao_matricula',
        '2': 'documentacao_transferencia',
        '3': 'documentacao_historico_escolar',
    },
        documentacao_declaracao_matricula : {
            '*': 'coleta_dados'
        },
        documentacao_transferencia: {
            '1': 'solicitar_primeira_via',
            '2': 'solicitar_segunda_via',
        },
        documentacao_historico_escolar: {
            '1': 'solicitar_primeira_via',
            '2': 'solicitar_segunda_via',
        },
        solicitar_primeira_via: {
            '*': 'coleta_dados'
        },
        solicitar_segunda_via: {
            '*': 'coleta_dados'
        },

    rh_menu: {
        '1': 'rh_enviar_curriculo',
        '2': 'rh_status_seletivo',
        '3': 'rh_sou_funcionario'
    },
        rh_enviar_curriculo: {
            '*': 'coleta_dados'
        },
        rh_status_seletivo: {
            '*': 'coleta_dados'
        }, 
        rh_sou_funcionario: {
            '1': 'rh_solicitar_holerite',
            '2': 'rh_banco_horas',
            '3': 'rh_relogio_ponto',
            '4': 'rh_outros_assuntos'
        },
        rh_solicitar_holerite: {
            '*': 'coleta_dados'
        },
        rh_banco_horas : {
            '*': 'coleta_dados'
        },
        rh_relogio_ponto: {
            '*': 'coleta_dados'
        },
};
