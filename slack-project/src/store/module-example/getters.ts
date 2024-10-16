import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const getters: GetterTree<ExampleStateInterface, StateInterface> = {
  loginError(state) {
    return state.loginError;
  },
  registrationError(state) {
    return state.registrationError;
  },
  isAuthenticated(state) {
    return !!state.user;
  }
};

export default getters;
