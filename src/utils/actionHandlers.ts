import * as evolutionApiService from '../services/evolutionApiService';
//import mensagensSistema from './mensagensSistema';
import { lerJson } from '../utils/jsonLoader';

const mensagensSistema = lerJson('mensagensSistema.json');

type Handler = (telefone: string) => Promise<void>;

interface ActionHandlers {
  [key: string]: {
    [key: string]: Handler;
  };
}

const actionHandlers: ActionHandlers = {
  financeiro_menu: {
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '3': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '4': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
  },
  financeiro_cancelamentos: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
  },
  financeiro_cancelamentos_extras_curriculares: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '3': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
  },

  documentacao_menu: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
  },
  documentacao_transferencia: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
  },
  documentacao_historico_escolar: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoAluno);
    },
  },

  rh_menu: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompleto);
    },
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompletoVaga);
    },
  },
  rh_sou_funcionario: {
    '1': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompleto);
    },
    '2': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.duvida);
    },
    '3': async (telefone: string) => {
      await evolutionApiService.enviarMensagem(telefone, mensagensSistema.nomeCompleto);
    }
  },
};

export = actionHandlers;
