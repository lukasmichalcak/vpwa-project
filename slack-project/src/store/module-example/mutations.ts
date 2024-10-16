import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_LOGIN_ERROR(state, error) {
    state.loginError = error;
  },
  SET_REGISTRATION_ERROR(state, error) {
    state.registrationError = error;
  }
};

export default mutation;
