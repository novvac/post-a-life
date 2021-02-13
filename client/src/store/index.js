import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    user(store) {
      return store.user;
    }
  },
  mutations: {
    setUser(store, payload) {
      if(!payload)
        store.user = null;
      else
        store.user = payload;
    }
  },
  actions: {
    setUser({commit}, payload) {
      commit('setUser', payload)
    },
    clearUser({commit}) {
      commit('setUser')
    }
  },
  modules: {
  }
})
