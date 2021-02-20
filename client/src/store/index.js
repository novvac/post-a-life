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
    },
  },
  mutations: {
    setUser(store, payload) {
      if(!payload)
        store.user = null;
      else
        store.user = payload;
    },
    setFriends(store, payload) {
      store.user.friends = payload;
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
        axios.all([
          axios.get("http://192.168.43.5:3000/api/user/id/"),
          axios.get("http://192.168.43.5:3000/api/user/friends/type/1")
        ]).then(axios.spread((user, friends) => {
          commit('setUser', user.data.user);
          commit('setFriends', friends.data.list);
          resolve(null);
        }))
        .catch(err => {
          if(err.response.status === 401)
            return this.dispatch("LOGOUT");
          
          reject(err);
        })
      })
    },
    LOAD_FRIENDS({commit}) {
      return new Promise((resolve, reject) => {
        axios.get("http://192.168.43.5:3000/api/user/friends/type/1")
          .then(res => {
            commit("setFriends", res.data.list);
            resolve(null);
          })
          .catch(err => {
            if(err.response.status === 401)
              return this.dispatch("LOGOUT");
            else
              reject(err);
          })
      })
    }
  },
  modules: {
  }
})
