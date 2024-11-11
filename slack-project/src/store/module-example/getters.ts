import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const getters: GetterTree<ExampleStateInterface, StateInterface> = {
  user(state) {
    return state.user;
  },

  firstName(state) {
    if (state.user) {
      return state.user.firstName;
    }
  },

  lastName(state) {
    if (state.user) {
      return state.user.lastName;
    }
  },

  username(state) {
    if (state.user) {
      return state.user.username;
    }
  },

  email(state) {
    if (state.user) {
      return state.user.email;
    }
  },

  password(state) {
    if (state.user) {
      return state.user.password;
    }
  },

  messages(state) {
    return state.messages;
  },

  unfinishedMessages(state) {
    return state.unfinished_messages;
  },

  loginError(state) {
    return state.loginError;
  },

  registrationError(state) {
    return state.registrationError;
  },

  commandJoin(state) {
    return state.commandJoin;
  },
  commandQuit(state) {
    return state.commandQuit;
  },
  commandCancel(state) {
    return state.commandCancel;
  },

  isAuthenticated(state) {
    return !!state.token;
  },

  token(state) {
    return state.token;
  },

  genericUsers(state) {
    return state.genericUsers;
  },
};

export default getters;
