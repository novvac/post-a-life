<template>
  <div class="accessed">
    <core-app-bar/>

    <core-left-drawer/>
    <core-right-drawer/>

    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';

export default {
  name: 'Accessed',
  components: {
    CoreAppBar: () => import('@/components/core/AppBar'),
    CoreLeftDrawer: () => import('@/components/core/LeftDrawer'),
    CoreRightDrawer: () => import('@/components/core/RightDrawer'),
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    loadUserInfo() {
      return this.$http.post('http://192.168.43.5:3000/api/user/me', {});
    },
    loadUser() {
      if(!this.user) {
        this.$http.all([this.loadUserInfo()])
          .then(this.$http.spread((usrInfo) => {
            console.log(usrInfo);
          }))
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
