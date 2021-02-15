<template>
    <div class="banner" style="position: relative; overflow: hidden; height: 320px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
        <v-btn v-if="owner" icon color="white" absolute bottom right style="z-index: 1;">
            <v-icon small>mdi-camera</v-icon>
        </v-btn>
        <v-img :src="src" height="100%"></v-img>
    </div>
</template>

<script>
export default {
    name: "UserProfileBanner",
    props: {
        src: {
            type: String,
            required: true,
        },
        owner: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style>
</style>