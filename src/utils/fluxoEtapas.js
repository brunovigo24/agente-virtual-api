module.exports = {
    rotas: {
        menu_principal: {
            '1': 'matriculas_menu',
            '2': 'coordenacao_menu',
            '3': 'financeiro_menu',
            '4': 'documentacao_menu',
            '5': 'rh_menu',
            '0': 'encerrar_atendimento'
        }
    },
    matriculas_menu: {
        '1': 'matriculas_infantil',
        '2': 'matriculas_anos_iniciais',
        '3': 'matriculas_anos_finais',
        '4': 'matriculas_ensino_medio',
    },
        matriculas_infantil: {
            '1': 'Agendar visita',
            '2': 'Solicitar vídeo institucional',
            '3': 'Solicitar mais informações'
        },

        matriculas_anos_iniciais: {
            '1': 'Agendar visita',
            '2': 'Solicitar mais informações'
        },

        matriculas_anos_finais: {
            '1': 'Agendar visita',
            '2': 'Solicitar mais informações'
        },

        matriculas_ensino_medio: {
            '1': 'Agendar visita',
            '2': 'Solicitar mais informações'
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
        },
        financeiro_negociar_valores: {
        },
        financeiro_copia_contrato: {
        },
        financeiro_irrf_2024: {
        },
        financeiro_cancelamentos: {
            '1': 'Período integral',
            '2': 'Matrícula total',
            '3': 'financeiro_extras_curriculares', 
        },
            financeiro_extras_curriculares: {
                '1': 'Basquete',
                '2': 'Futsal',
                '3': 'Vôlei',
            },

    documentacao_menu: {
        '1': 'documentacao_declaracao_matricula',
        '2': 'documentacao_transferencia',
        '3': 'documentacao_historico_escolar',
    },
        documentacao_transferencia: {
            '1': 'Solicitar 1ª via',
            '2': 'Solicitar 2ª via',
        },
        documentacao_historico_escolar: {
            '1': 'Solicitar 1ª via',
            '2': 'Solicitar 2ª via',
        },

    rh_menu: {
        '1': 'rh_enviar_curriculo',
        '2': 'rh_status_seletivo',
        '3': 'rh_sou_funcionario'
    },
        rh_status_seletivo: {
            '1': 'Me diga seu nome completo e a vaga que está participando'
        }, 
        rh_sou_funcionario: {
            '1': 'rh_solicitar_holerite',
            '2': 'rh_banco_horas',
            '3': 'rh_relogio_ponto',
            '4': 'rh_outros_assuntos'
        },
};
