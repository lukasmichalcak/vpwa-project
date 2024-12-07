import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';
import state from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  SET_USER(state, user) {
    state.user = user;
    console.log('user', user);
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  SET_CHANNELS(state, channels) {
    state.channels = channels;
  },

  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },

  SET_SELECTED_CHANNEL(state, selectedChannel: number) {
    state.selectedChannel = selectedChannel;
  },

  SET_NEW_MESSAGE(state, newMessage) {
    state.newMessage = newMessage;
  },
  
  CLEAR_AUTH(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
  },

  SET_FIRST_NAME(state, firstName) {
    if (state.user) {
      state.user.firstName = firstName;
    }
  },

  SET_LAST_NAME(state, lastName) {
    if (state.user) {
      state.user.lastName = lastName;
    }
  },

  SET_USERNAME(state, username) {
    if (state.user) {
      state.user.username = username;
    }
  },

  SET_EMAIL(state, email) {
    if (state.user) {
      state.user.email = email;
    }
  },

  SET_PASSWORD(state, password) {
    if (state.user) {
      state.user.password = password;
    }
  },

  SET_STATE(state, State) {
    if (state.user) {
      state.user.state = State;
    }
  },

  SET_USER_NULL(state) {
    state.user = null;
  },

  ADD_MESSAGE(state, message) {
    state.messages.push(message);
  },

  SET_TYPING_MESSAGE(state, message) {
    state.typingMessage = message;
  },

  LOAD_USER_CHANNELS(state, userChannels) {
    state.userChannels.push(userChannels);
  },

  ADD_HISTORIC_MESSAGE(state, message) {
    state.messages.unshift(message);
  },

  ADD_UNFINISHED_MESSAGE(state, unfinished_message) {
    state.unfinished_messages.push(unfinished_message);
  },

  SET_LOGIN_ERROR(state, error) {
    state.loginError = error;
  },

  SET_REGISTRATION_ERROR(state, error) {
    state.registrationError = error;
  },

  SET_GENERIC_USERS(state, genericUsers) {
    state.genericUsers = genericUsers;
  },

  ADD_USER(state, user) {
    if (state.genericUsers) {
      state.genericUsers.push(user);
    }
  },
  SET_COMMAND_JOIN(state, commandJoin) {
    state.commandJoin = commandJoin;
  },
  SET_COMMAND_QUIT(state, commandQuit) {
    state.commandQuit = commandQuit;
  },
  SET_COMMAND_CANCEL(state, commandCancel) {
    state.commandCancel = commandCancel;
  },
  RESET_STATE(currentState) {
    Object.assign(currentState, state());
  },
};

export default mutation;
