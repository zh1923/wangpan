import type { Commit } from 'vuex';

const state = {
  count: 0,
};

const getters = {
  getDataTest: () => {
    return state.count;
  },
};
const mutations = {
  setTestData: (state: any) => {
    state.count++;
  },
};

const actions = {
  actionSetTestData: (context: { commit: Commit }, data?: any) => {
    context.commit('setTestData', data);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
