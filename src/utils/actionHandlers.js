const evolutionApiService = require('../services/evolutionApiService');

module.exports = {
  rh_menu: {
    '2': async (telefone) => {
      await evolutionApiService.enviarMensagem(telefone, 'Me diga seu nome completo e a vaga que está participando');
    },
  },
};
