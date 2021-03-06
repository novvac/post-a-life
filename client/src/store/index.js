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
    userEvents: null,
    userSnackbar: {model: false, msg: null, color: null},
    invitationsEvents: [],
    interestedEvents: [],
    participantEvents: [],
    receivedInvitations: [],
    socket: null,
    newMessage: false,
    eventsDialog: null,
    inviteFriends: {dialog: false},
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
    userEvents(store) {
      return store.userEvents;
    },
    userSnackbar(store) {
      return store.userSnackbar;
    },
    invitationsEvents(store) {
      return store.invitationsEvents;
    },
    interestedEvents(store) {
      return store.interestedEvents;
    },
    participantEvents(store) {
      return store.participantEvents;
    },
    receivedInvitations(store) {
      return store.receivedInvitations;
    },
    newMessage(store) {
      return store.newMessage;
    },
    eventsDialog(store) {
      return store.eventsDialog;
    },
    inviteFriends(store) {
      return store.inviteFriends;
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
    setUserEvents(store, payload) {
      store.userEvents = payload;
    },
    setUserSnackbar(store, payload) {
      store.userSnackbar = payload;
    },
    setInvitationsEvents(store, payload) {
      store.invitationsEvents = payload;
    },
    setInterestedEvents(store, payload) {
      store.interestedEvents = payload;
    },
    setParticipantEvents(store, payload) {
      store.participantEvents = payload;
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
    },
    setEventsDialog(store, payload) {
      store.eventsDialog = payload;
    },
    setInviteFriends(store, payload) {
      store.inviteFriends = payload;
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
          axios.get("user/id/"),
          axios.get("user/friends/type/1")
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
        axios.get("user/friends/type/1")
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
    async LOAD_INVITATIONS_EVENTS({commit}) {
      await axios.get("event/invitations/").then(res => {
        commit('setInvitationsEvents', res.data);
      }).catch(err => {
        if(err.response) {
          if(err.response.status === 401)
            return this.dispatch("LOGOUT");
        }
      })
    },
    async LOAD_USER_EVENTS({commit}) {
      await axios.get("event/user-events").then(res => {
        commit('setUserEvents', res.data);
      }).catch(err => {
        if(err.response) {
          if(err.response.status === 401)
            return this.dispatch("LOGOUT");
        }
      })
    },
    SET_USER_SNACKBAR({commit}, payload) {
      commit('setUserSnackbar', payload);
      this.dispatch("LOAD_USER");
    },
    async LOAD_INTERESTED_EVENTS({commit}) {
      await axios.get("event/interested").then(res => {
        commit('setInterestedEvents', res.data);
      }).catch(err => {
        if(err.response) {
          if(err.response.status === 401)
            return this.dispatch("LOGOUT");
        }
      })
    },
    async LOAD_PARTICIPANT_EVENTS({commit}) {
      await axios.get("event/participant").then(res => {
        commit('setParticipantEvents', res.data);
      }).catch(err => {
        if(err.response) {
          if(err.response.status === 401)
            return this.dispatch("LOGOUT");
        }
      })
    },
    INVITATION_MANAGER({commit}, payload) {
      return new Promise((resolve, reject) => {
        let url = "user/friend/";
        let data = {}

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
      axios.get("user/friends/type/3")
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
    },
    SET_EVENTS_DIALOG({commit}, payload) {
      commit('setEventsDialog', payload);
    },
    SET_INVITE_FRIENDS({commit}, payload) {
      commit('setInviteFriends', payload);
    },
    async DELETE_EVENT_INVITE({commit}, payload) {
      await axios.delete('event/invitation/' + payload).then(res => {
        this.dispatch("LOAD_INVITATIONS_EVENTS");
      }).catch(err => {
        if(err.response) {
          if(err.reponse.status === 401)
            this.dispatch("LOGOUT");
        }
        console.log(err);
      })
    }
  },
  modules: {
  }
})
