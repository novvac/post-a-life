<template>
    <v-navigation-drawer
        app
        floating
        clipped
    >
        <v-list class="ma-0 pa-0">
            <v-list-item
                v-for="link in links"
                :key="link.icon"
                :to="link.to"
            >
                <v-icon>mdi-{{link.icon}}</v-icon>

                {{link.text}}
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "CoreLeftDrawer",
    data() {
        return {
            links: [
                {icon: "home", text: "Home", to: "/app"},
                {icon: "account-multiple", text: "Friends", to: "/app/friends"},
                {icon: "calendar-blank", text: "Events", to: "/app/events"},
                {icon: "video", text: "Watch videos", to: "/app/videos"},
                {icon: "folder-image", text: "Photos", to: "/app/photos"},
                {icon: "file-multiple", text: "Files", to: "/app/files"},
            ]
        }
    }
}
</script>

<style>

</style>