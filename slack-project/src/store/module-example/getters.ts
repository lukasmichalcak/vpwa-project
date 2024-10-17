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

  loginError(state) {
    return state.loginError;
  },

  registrationError(state) {
    return state.registrationError;
  },

  // isAuthenticated(state) {
  //   return !!state.username;
  // }

  genericUsers(state) {
    return state.genericUsers;
  },
};

export default getters;
