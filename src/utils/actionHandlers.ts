const evolutionApiService = require('../services/evolutionApiService');
const mensagensSistema = require('../utils/mensagensSistema');

interface ActionHandlerFunction {
    (telefone: string): Promise<void>;
}

interface ActionHandlerGroup {
    [key: string]: ActionHandlerFunction;
} // Testar se essas interfaces estão corretas

interface ActionHandlers {
    financeiro_menu: ActionHandlerGroup;
    financeiro_cancelamentos: ActionHandlerGroup;
    financeiro_cancelamentos_extras_curriculares: ActionHandlerGroup;
    documentacao_menu: ActionHandlerGroup;
    documentacao_transferencia: ActionHandlerGroup;
    documentacao_historico_escolar: ActionHandlerGroup;
    rh_menu: ActionHandlerGroup;
    rh_sou_funcionario: ActionHandlerGroup;
} // Testar se essas interfaces estão corretas

export const actionHandlers: ActionHandlers = {
    financeiro_menu : {
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '3': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '4': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
    },
    financeiro_cancelamentos: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
    },
    financeiro_cancelamentos_extras_curriculares: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '3': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
    },

    documentacao_menu: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
    },
    documentacao_transferencia: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
    },
    documentacao_historico_escolar: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
        },
    },

    rh_menu: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompleto);
        },
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoVaga);
        },
    },
    rh_sou_funcionario: {
        '1': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompleto);
        },
        '2': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.duvida);
        },
        '3': async (telefone) => {
            await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompleto);
        }
    },

};
