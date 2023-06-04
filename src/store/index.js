import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import language from './language';

const uuid = require('uuid/v4');
const config = require('../../config.json');

Vue.use(Vuex);

const persistedState = createPersistedState({
  paths: ['language'],
});

export default new Vuex.Store({
  modules: {
    language,
  },
  plugins: [persistedState],
  state: {
    config: null,
    verbose: {
      status: 0,
      sessionId: null,
      metadata: null,
      data: null,
      errors: {
        load: false,
        unsupported: false,
      },
    },
  },


  getters: {
    config: state => state.config,

    verbose: state => state.verbose,

    // eslint-disable-next-line max-len
    modifiedSessions: (state, getters) => getters.sessionSet.filter(session => (session.new || session.modified))
      .map(session => session.id),
  },


  mutations: {
    setConfig: (state, configData) => {
      state.config = configData;
    },

    setVerboseData(state, { data, status }) {
      state.verbose.status = status;

      if (!data) {
        return;
      }

      if (!data.data) {
        throw new Error('Invalid verbose data');
      }

      state.verbose.data = data.data.map(node => ({
        ...node,
        id: uuid(),
      }));
      state.verbose.metadata = data.metadata;
      state.verbose.sessionId = data.sessionId;
    },

    setVerboseLoadError(state, value = true) {
      state.verbose.errors.load = value;
    },

    setVerboseUnsupportedError(state, value = true) {
      state.verbose.errors.unsupported = value;
    },
  },


  actions: {
    getAppData: async ({ commit, dispatch }) => {
      commit('setConfig', config);
    },

    async getVerboseData({ commit }, sessionId) {
      commit('setVerboseLoadError', false);
      commit('setVerboseUnsupportedError', false);

      if (!sessionId) {
        commit('setVerboseLoadError');
        throw new Error('Invalid session ID');
      }

      const [firstChar] = sessionId;

      if (['?', '#'].includes(firstChar)) {
        commit('setVerboseUnsupportedError');
        commit('setVerboseData', { data: null, status: 3 });
        throw new Error('Unsupported version');
      }

      try {
        commit('setVerboseData', { data: null, status: 0 });
        if (sessionId === 'demo') {
          commit('setVerboseData', { data: null, status: 1 });
          const { default: data } = await import('../data/verbose-demo.json');
          commit('setVerboseData', { data, status: 2 });
        } else {
          commit('setVerboseData', { data: null, status: 1 });
          const response = await axios.get(`${config.bytebin_url}${sessionId}`);
          const data = {
            ...response.data,
            sessionId,
          };
          commit('setVerboseData', { data, status: 2 });
        }
      } catch (error) {
        console.error(`${error.message} - session ID: ${sessionId}`);
        commit('setVerboseLoadError');
        commit('setVerboseData', { data: null, status: 3 });
        throw new Error('Loading error');
      }
    },
  },
});
