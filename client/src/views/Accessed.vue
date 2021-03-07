<template>
  <div class="accessed" v-if="!loading">
    <core-app-bar/>

    <core-left-drawer/>
    <core-right-drawer/>

    <v-main style="min-height: 100vh;">
      <!-- DIALOG EVENTS WINDOW -->
        <v-dialog v-model="eventsDialog" persistent max-width="1000px">
          <base-card without-padding>
              <div>
                  <v-row class="ma-0 pa-5" align="center">
                      <v-spacer></v-spacer>

                      <v-btn icon @click="SET_EVENTS_DIALOG(null)">
                          <v-icon>mdi-close</v-icon>
                      </v-btn>
                  </v-row>

                  <component v-if="eventsDialog" :is="eventsDialog.component"/>
              </div>
          </base-card>
      </v-dialog>

      <v-dialog v-model="inviteFriends.dialog" persistent max-width="600" scrollable>
          <base-card without-padding>
              <v-row class="ma-0 pa-5" align="center">
                  <p class="ma-0 pa-0">
                      Zaproś znajomych
                  </p>

                  <v-spacer></v-spacer>

                  <v-btn icon @click="SET_INVITE_FRIENDS({dialog: false, id: null})">
                      <v-icon>mdi-close</v-icon>
                  </v-btn>
              </v-row>

              <component :is="'invite-friends'"/>
          </base-card>
      </v-dialog>

      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions,
} from 'vuex';

export default {
  name: 'Accessed',
  data() {
    return {
      loading: false,
    }
  },
  components: {
    CoreAppBar: () => import('@/components/core/AppBar'),
    CoreLeftDrawer: () => import('@/components/core/LeftDrawer'),
    CoreRightDrawer: () => import('@/components/core/RightDrawer'),

    NewEvent: () => import('@/components/Events/dialog/newEvent'),
    EventDetails: () => import('@/components/Events/dialog/eventDetails'),
    InviteFriends: () => import('@/components/Events/dialog/inviteFriends'),
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['eventsDialog']),
    ...mapGetters(['inviteFriends']),
  },
  methods: {
    ...mapActions(['SET_EVENTS_DIALOG']),
    ...mapActions(['LOAD_USER']),
    ...mapActions(['SET_INVITE_FRIENDS']),
    ...mapActions(['OPEN_SOCKET']),
    loadUser() {
      if(!this.user) {
        this.loading = true;
        this.LOAD_USER().then(() => {
          this.OPEN_SOCKET();
          this.loading = false;
        })
      }
    }
  },
  created() {
    this.loadUser();
  },
  watch: {
    $route(to, from) {
      this.loadUser();
    }
  }
}
</script>
