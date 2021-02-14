<template>
    <div class="background black" style="overflow: hidden; height: 320px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
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
        }
    }
}
</script>

<style>

</style>