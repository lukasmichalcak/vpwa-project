import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  login({ commit, getters }, { username, password }) {
    return new Promise<void>((resolve, reject) => {
      if (!username || !password) {
        commit('SET_LOGIN_ERROR', 'All fields must be filled');
        reject(new Error('Fields missing'));
      } else if (
        getters.genericUsers.some(
          (user: { username: string }) => user.username === username
        )
      ) {
        commit('SET_LOGIN_ERROR', 'Username already taken');
        reject(new Error('Taken username'));
      } else {
        commit('SET_USERNAME', username);
        // will handle password later, probably will commit a hash
        commit('SET_LOGIN_ERROR', '');
        resolve();
      }
    });
  },

  register(
    { commit, getters },
    { firstName, lastName, username, email, password }
  ) {
    return new Promise<void>((resolve, reject) => {
      if (!firstName || !lastName || !username || !email || !password) {
        commit('SET_REGISTRATION_ERROR', 'All fields must be filled');
        reject(new Error('Fields missing'));
      } else if (
        getters.genericUsers.some(
          (user: { username: string }) => user.username === username
        )
      ) {
        commit('SET_Registration_ERROR', 'Username already taken');
        reject(new Error('Taken username'));
      } else {
        const user = {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
        };
        commit('SET_USER', user);
        // will handle password later, probably will commit a hash
        commit('SET_REGISTRATION_ERROR', '');
        resolve();
      }
    });
  },

  logout({ commit }) {
    commit('SET_USER_NULL');
  },

  generateUsers({ commit, getters }) {
    if (getters.genericUsers) {
      // preventive guardrail should the function call change somehow
      return;
    }

    const firstNames = ['Kevin', 'Jacob', 'Emma', 'Sarah', 'Max'];
    const lastNames = ['Smith', 'Johnson', 'Turner', 'Connor', 'Connor'];
    const usernames = [
      'Kevin_da_G',
      'Ur_mom_123',
      'Anonymous_user',
      'Clear_fantasy',
      'General_Kenobi',
    ];
    const emails = [
      'kevin.smith@gmail.com',
      'jacob.johnson123@gmail.com',
      'emmaturner89456@gmail.com',
      'sarah.connor@gmail.com',
      'max.connor123jedi@gmail.com',
    ];
    const passwords = [
      'secret_password_123',
      'its_yourMom',
      'Anonymous_user_verySecretPasswd',
      'I will be back',
      'I have the high ground',
    ]; // not hashed yet
    const users: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
    }[] = [];

    for (let i = 0; i < 5; i++) {
      users.push({
        firstName: firstNames[i],
        lastName: lastNames[i],
        username: usernames[i],
        email: emails[i],
        password: passwords[i],
      });
    }

    commit('SET_GENERIC_USERS', users);
  },
};

export default actions;
