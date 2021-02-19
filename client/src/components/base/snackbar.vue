<template>
    <v-snackbar
        v-bind="$attrs"
        v-on="$listeners"
        color="success"
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