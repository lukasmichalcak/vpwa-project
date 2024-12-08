import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const getters: GetterTree<ExampleStateInterface, StateInterface> = {
  user(state) {
    return state.user;
  },

  userID(state) {
    if (state.user) {
      return state.user.id;
    }
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

  state(state) {
    if (state.user) {
      return state.user.state;
    }
  },

  messages(state) {
    return state.messages;
  },

  users(state) {
    return state.users;
  },

  userChannels(state) {
    return state.userChannels;
  },

  selectedChannel(state) {
    return state.selectedChannel;
  },

  typingMessage(state) {
    return state.typingMessage;
  },

  newMessage(state) {
    return state.newMessage;
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

  channels(state) {
    return state.channels;
  },

  genericUsers(state) {
    return state.genericUsers;
  },
};

export default getters;
