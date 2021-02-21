<template>
    <v-snackbar
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot/>
    </v-snackbar>
</template>

<script>
export default {
    name: "BaseSnackbar",
}
</script>

<style>

</style>