<template>
    <div class="avatar">
        <v-avatar size="160" :class="owner ? 'owner' : undefined">
            <v-img :src="src"></v-img>

            <v-btn v-owner x-large icon absolute center color="white" style="z-index:2" class="icon">
                <v-icon>mdi-camera</v-icon>
            </v-btn>
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
        },
        owner: {
            type: Boolean,
            default: false,
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

        &.owner:after {
            opacity: 0;
            z-index:1;
            content: "";
            position: absolute;
            top:0;left:0;right:0;bottom:0;
            background: black;
            transition: 250ms;
        }
        &.owner:hover:after {
            opacity: .6;
        }
        .icon {
            display: none;
        }
        &.owner:hover .icon {
            display: block;
        }
    }
}
</style>