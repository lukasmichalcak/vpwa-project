import { Commit } from 'vuex';

interface GlobalState {
  command: string;
}

export default {
  state: (): GlobalState => ({
    command: ' ',
  }),

  mutations: {
    SET_GLOBAL_VARIABLE(state: GlobalState, value: string) {
      state.command = value;
    },
  },

  actions: {
    updateGlobalVariable({ commit }: { commit: Commit }, value: string) {
      commit('SET_GLOBAL_VARIABLE', value);
    },
  },
};
