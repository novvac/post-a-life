<template>
    <div class="avatar">
        <v-avatar size="160">
            <v-img :src="src"></v-img>
        </v-avatar>
    </div>
</template>

<script>
export default {
    name: "UserAvatar",
    props: {
        src: {
            type: String,
            required: true,
        }
    }
}
</script>

<style lang="scss">
.avatar {
    width: 100%;
    height: 60px;
    position: relative;

    .v-avatar {
        transform: translate(-50%, -60%);
        left: 50%;
        position: absolute;
        border: 6px solid white;
    }
}
</style>