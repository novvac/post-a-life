<template>
  <div class="accessed">
    <core-app-bar/>

    <core-left-drawer/>
    <core-right-drawer/>
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
