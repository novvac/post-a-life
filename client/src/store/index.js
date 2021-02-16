import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

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
    },
    LOAD_USER({commit}) {
      return new Promise((resolve, reject) => {
        axios.get("http://192.168.43.5:3000/api/user/")
          .then(res => {
            commit('setUser', res.data.user);
            resolve(null);
          })
          .catch(err => {
            if(err.response.status === 401) {
              if(this.$cookies.get("token"))
                this.$cookies.remove("token");
              this.$router.push("/auth/login");
            } else {
              reject(err);
            }            
          })
      })
    }
  },
  modules: {
  }
})
