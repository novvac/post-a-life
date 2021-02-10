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
export default {
  name: 'Accessed',
  components: {
    CoreAppBar: () => import('@/components/core/AppBar'),
    CoreLeftDrawer: () => import('@/components/core/LeftDrawer'),
    CoreRightDrawer: () => import('@/components/core/RightDrawer'),
  }
}
</script>
