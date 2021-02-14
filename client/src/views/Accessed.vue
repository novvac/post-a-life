<template>
  <div class="accessed" v-if="loaded">
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
  mapActions,
} from 'vuex';

export default {
  name: 'Accessed',
  data() {
    return {
      loaded: true,
    }
  },
  components: {
    CoreAppBar: () => import('@/components/core/AppBar'),
    CoreLeftDrawer: () => import('@/components/core/LeftDrawer'),
    CoreRightDrawer: () => import('@/components/core/RightDrawer'),
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['setUser']),
    loadUserInfo() {
      return this.$http.get('http://192.168.43.5:3000/api/user/me');
    },
    LOAD_USER() {
      if(!this.user) {
        this.loaded = false;
        this.$http.all([this.loadUserInfo()])
          .then(this.$http.spread((usrInfo) => {
            // set user info
            this.setUser(usrInfo.data);
            
            this.loaded = true;
          }))
          .catch(err => {
            if(err.response.status === 401) {
              if(this.$cookies.get("token"))
                this.$cookies.remove("token");
              this.$router.push("/auth/login");
            }
          })
      }
    }
  },
  created() {
    this.LOAD_USER();
  },
  watch: {
    $route(to, from) {
      this.LOAD_USER();
    }
  }
}
</script>
