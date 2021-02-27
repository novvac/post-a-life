import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import VueCookies from 'vue-cookies';
import router from '../router/index';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    friends: null,
    receivedInvitations: [],
    socket: null,
    newMessage: false,
  },
  getters: {
    user(store) {
      return store.user;
    },
    socket(store) {
      return store.socket;
    },
    friends(store) {
      return store.friends;
    },
    receivedInvitations(store) {
      return store.receivedInvitations;
    },
    newMessage(store) {
      return store.newMessage;
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
      if(payload)
        store.friends = payload;
      else
        store.friends = null;
    },
    setSocket(store, payload) {
      if(!payload) {
        store.socket.close();
        store.socket = null;
      }
      else
        store.socket = payload;
    },
    setReceivedInvitations(store, payload) {
      store.receivedInvitations = payload;
    },
    setNewMessage(store, payload) {
      store.newMessage = payload;
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

        ws.addEventListener("message", (e) => {
          this.dispatch(e.data);
        })

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
      axios.get("http://192.168.43.5:3000/api/user/friends/type/3")
        .then(res => {
          commit("setReceivedInvitations", res.data.list);
        })
        .catch(err => {
            if(err.response.status === 401)
                this.LOGOUT();
        })
    },
    NEW_MESSAGE({commit}) {
      commit('setNewMessage', true);
    },
    RESET_NEW_MESSAGE({commit}) {
      commit('setNewMessage', false);
    }
  },
  modules: {
  }
})
