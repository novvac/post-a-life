<template>
  <div class="accessed" v-if="!loading">
    <core-app-bar/>

    <core-left-drawer/>
    <core-right-drawer/>

    <v-main style="min-height: 100vh;">
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
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['LOAD_USER']),
    ...mapActions(['OPEN_SOCKET']),
    loadUser() {
      if(!this.user) {
        this.loading = true;
        this.LOAD_USER().then(() => {
          this.loading = false;
        })
      }
    }
  },
  created() {
    this.loadUser();

    this.OPEN_SOCKET();
  },
  watch: {
    $route(to, from) {
      this.loadUser();
      this.OPEN_SOCKET();
    }
  }
}
</script>
