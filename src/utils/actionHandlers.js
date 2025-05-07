const evolutionApiService = require('../services/evolutionApiService');
const mensagensSistema = require('../utils/mensagensSistema');

module.exports = {
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
  financeiro_extras_curriculares: {
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
