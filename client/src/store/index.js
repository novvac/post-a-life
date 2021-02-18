import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import VueCookies from 'vue-cookies';
import router from '../router/index';

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
    LOGOUT({commit}) {
      if(VueCookies.get("token"))
        VueCookies.remove("token");
      router.push("/auth/login");
      commit('setUser', null);
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
              this.dispatch("LOGOUT");
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
