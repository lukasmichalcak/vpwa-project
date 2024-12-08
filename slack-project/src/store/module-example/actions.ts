import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';
import { api } from 'src/boot/axios';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async login({ commit }, { username, password }) {
    try {
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        commit('SET_TOKEN', result.token);
        commit('SET_USER', result.user);
        commit('SET_LOGIN_ERROR', '');
      } else {
        commit(
          'SET_LOGIN_ERROR',
          result.message || 'Invalid username or password'
        );
      }
    } catch (error) {
      commit('SET_LOGIN_ERROR', 'Network error');
    }
  },

  async register(
    { commit },
    { firstName, lastName, username, email, password }
  ) {
    try {
      const response = await fetch('http://localhost:3333/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        commit('SET_TOKEN', result.token);
        commit('SET_USER', result.user);
        commit('SET_REGISTRATION_ERROR', '');
      } else {
        commit(
          'SET_REGISTRATION_ERROR',
          result.message || 'Registration failed'
        );
      }
    } catch (error) {
      commit('SET_REGISTRATION_ERROR', 'Network error');
    }
  },

  async logout({ commit, getters }) {
    try {
      await fetch('http://localhost:3333/logout', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getters.token}` },
      });
      commit('CLEAR_AUTH');
      commit('RESET_STATE');
    } catch (error) {
      console.error('Logout failed', error);
    }
  },

  async me({ commit, getters }) {
    try {
      const response = await fetch('http://localhost:3333/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${getters.token}` },
      });
      const result = await response.json();
      if (response.ok) {
        commit('SET_USER', result.user);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  },

  async api({ getters }, { method, url, payload = {} }) {
    const response = await fetch(`http://localhost:3333${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getters.token}`,
      },
      body: method !== 'GET' ? JSON.stringify(payload) : undefined,
    });
    return response.json();
  },

  async updateState({ commit, getters }, newState) {
    try {
      const response = await fetch('http://localhost:3333/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getters.token}`,
        },
        body: JSON.stringify({ state: newState }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update state');
      }

      commit('SET_STATE', data.state);
    } catch (error) {
      console.error('Error updating state:', error);
    }
  },

  async fetchChannels({ commit, getters }) {
    const response = await fetch('http://localhost:3333/channelList', {
      headers: { Authorization: `Bearer ${getters.token}` },
    });
    const channels = await response.json();
    commit('SET_CHANNELS', channels);
  },

  async fetchChannelMessages({ commit, getters }, channelID: number) {
    const response = await fetch(
      `http://localhost:3333/channel/${channelID}/messages`,
      {
        headers: { Authorization: `Bearer ${getters.token}` },
      }
    );
    const responsedata = await response.json();

    const messages = responsedata.data || responsedata;
    commit('SET_MESSAGES', messages);
  },

  async fetchChannelUsers({ commit, getters }, channelID: number) {
    const response = await fetch(
      `http://localhost:3333/channel/${channelID}/users`,
      {
        headers: { Authorization: `Bearer ${getters.token}` },
      }
    );
    const responsedata = await response.json();

    const users = responsedata.data || responsedata;
    commit('SET_USERS', users);
  },

  async storeMessage({ getters }, { channelId, text, username }) {
    console.log('storeMessage', { channelId, text, username });
    const response = await fetch(
      `http://localhost:3333/channel/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getters.token}`,
        },
        body: JSON.stringify({ channelId, text, username }),
      }
    );
    const message = await response.json();
    console.log('storeMessage', message);
    // commit('ADD_MESSAGE', message);
  },

  async typingMessage({ commit }, data) {
    commit('SET_TYPING_MESSAGE', data);
  },

  async setNotificationSetting({ commit }, data) {
    commit('SET_NOTIFICATION_SETTING', data);
  },

  async userStatusChange({ commit }, data) {
    commit('SET_USER_STATUS_CHANGE', data);
  },

  async setSelectedChannel({ commit }, channelID: number) {
    commit('SET_SELECTED_CHANNEL', channelID);
  },

  async fetchUserChannels({ commit, getters }) {
    try {
      const response = await api.get('/fetchUserChannels', {
        headers: {
          Authorization: `Bearer ${getters.token}`,
        },
      });

      type ChannelData = {
        name: string;
        adminId: number;
        channelType: string;
        users: { id: number; username: string }[];
        messages: MessageData[];
      };

      type MessageData = {
        id: number;
        text: string;
        author: { id: number; name: string };
        createdAt: string | null;
      };

      const userChannels: Record<number, ChannelData> = response.data;
      Object.values(userChannels).forEach((channel) => {
        // console.log(`Channel: ${channel.name}`);
        channel.messages = transformMessages(channel.messages);
      });

      // Flatten all messages across all channels
      // const allMessages: MessageData[] = Object.values(userChannels).flatMap(
      //   (channel) => channel.messages
      // );
      // console.log(allMessages);
      commit('LOAD_USER_CHANNELS', response.data);
    } catch (error) {
      console.error('Error fetching user channels:', error);
      throw error;
    }
  },

  async createChannel({ getters }, { name, admin_id, channel_type }) {
    await fetch('http://localhost:3333/createChannel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getters.token}`,
      },
      body: JSON.stringify({ name, admin_id, channel_type }),
    });
  },

  async removeChannel({ getters }, { id, userID, action }) {
    console.log('removeChannel', { id, userID, action });
    await fetch('http://localhost:3333/removeChannel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getters.token}`,
      },
      body: JSON.stringify({ id, userID, action }),
    });
  },

  async setNewMessage({ commit }, message) {
    commit('SET_NEW_MESSAGE', message);
  },

  generateUsers({ commit, getters }) {
    if (getters.genericUsers) {
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
    ];
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

  addMessage({ commit }, message) {
    commit('ADD_MESSAGE', message);
  },

  addHistoricMessage({ commit }, message) {
    commit('ADD_HISTORIC_MESSAGE', message);
  },

  addUnfinishedMessage({ commit }, unfinished_message) {
    commit('ADD_UNFINISHED_MESSAGE', unfinished_message);
  },

  join({ commit }, command) {
    commit('SET_COMMAND_JOIN', command);
  },
  quit({ commit }, command) {
    commit('SET_COMMAND_QUIT', command);
  },
  cancel({ commit }, command) {
    commit('SET_COMMAND_CANCEL', command);
  },
};

export default actions;
function transformMessages(
  messages: {
    id: number;
    text: string;
    author: { id: number; name: string };
    createdAt: string | null;
  }[]
): {
  id: number;
  text: string;
  author: { id: number; name: string };
  createdAt: string | null;
}[] {
  return messages.map((message) => ({
    ...message,
    text: message.text.trim(),
    createdAt: message.createdAt
      ? new Date(message.createdAt).toISOString()
      : null,
  }));
}
