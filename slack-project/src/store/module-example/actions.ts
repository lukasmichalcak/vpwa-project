import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  login({ commit }, { username, password }) {
    return new Promise<void>((resolve, reject) => {
      if (!username || !password) {
        commit('SET_LOGIN_ERROR', 'All fields must be filled');
        reject(new Error('Fields missing'));
      } else {
        commit('SET_USERNAME', username);
        // will handle password later, probably will commit a hash
        commit('SET_LOGIN_ERROR', '');
        resolve();
      }
    });
  },
  
  register({ commit }, { firstName, lastName, username, email, password }) {
    return new Promise<void>((resolve, reject) => {
      if (!firstName || !lastName || !username || !email || !password) {
        commit('SET_REGISTRATION_ERROR', 'All fields must be filled');
        reject(new Error('Fields missing'));
      } else {
        const user = {firstName: firstName, lastName: lastName, username: username, email: email, password: password}
        commit('SET_USER', user);
        // will handle password later, probably will commit a hash
        commit('SET_REGISTRATION_ERROR', '');
        resolve();
      }
    });
  },

  logout({ commit }) {
    commit('SET_USER_NULL');
  }
};

export default actions;
