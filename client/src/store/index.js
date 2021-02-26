import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import VueCookies from 'vue-cookies';
import router from '../router/index';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    socket: null,
  },
  getters: {
    user(store) {
      return store.user;
    },
    socket(store) {
      return store.socket;
    }
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
    },
    setSocket(store, payload) {
      if(!payload) {
        store.socket.close();
        store.socket = null;
      }
      else
        store.socket = payload;
    }
  },
  actions: {
    setUser({commit}, payload) {
      commit('setUser', payload)
    },
    OPEN_SOCKET({commit}) {
      if(this.state.socket === null) {
        let ws = new WebSocket("ws://192.168.43.5:3000/");

        ws.onopen = function(event) {
          let data = {token: null};
          if(VueCookies.get("token"))
            data.token = VueCookies.get("token");
          
          ws.send(JSON.stringify(data));
        }

        ws.onmessage = function(msg) {
          if(msg.data === "LOAD_INVITATIONS")
            console.log("ŁADUJ ZAPROSZENIA KURWA XDDD");
          
          console.log('lol');
        }

        if(VueCookies.get("token"))
          commit('setSocket', ws);
        else
          this.dispatch('LOGOUT');
      }
    },
    LOGOUT({commit}) {
      commit('setSocket', null);
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
          if(err.response) {
            if(err.response.status === 401)
              return this.dispatch("LOGOUT");
          }
          
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
            if(err.response) {
              if(err.response.status === 401)
                return this.dispatch("LOGOUT");
            }
            
            reject(err);
          })
      })
    },
    INVITATION_MANAGER({commit}, payload) {
      return new Promise((resolve, reject) => {
        let url = "http://192.168.43.5:3000/api/user/friend/";
        let data = {}

        console.log(payload);

        if(payload.action === "put" || payload.action === "delete") {
            url += payload.id;
        } else {
            data.id = payload.id
        }

        axios({
            method: payload.action,
            url: url,
            data: data,
        }).then(res => {
            resolve(res.data.status);
        }).catch(err => {
          if(err.response) {
            if(err.response.status === 401)
              return this.dispatch("LOGOUT");
          }

          reject(err);
        })
      })
    },
    LOAD_INVITATIONS({commit}) {
      console.log("ładowanie zaproszeń");
    }
  },
  modules: {
  }
})
