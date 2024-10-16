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
        commit('SET_USER', { username });
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
        commit('SET_USER', { username });
        // will handle password later, probably will commit a hash
        // will handle other setters later when relevant
        commit('SET_REGISTRATION_ERROR', '');
        resolve();
      }
    });
  }
};

export default actions;
