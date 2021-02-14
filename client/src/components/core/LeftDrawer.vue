<template>
    <v-navigation-drawer
        app
        floating
        clipped
    >
        <base-card class="grey lighten-3 ma-5" dense>
            <v-list class="pa-0">
                <v-list-item class="ma-0 pa-0">
                    <v-avatar size="36">
                        <v-img src="https://i.pinimg.com/originals/bb/0c/07/bb0c074019ee55b098fb023ec53be7fb.png"></v-img>
                    </v-avatar>

                    <div class="ml-3 d-flex align-center justify-space-between" style="width: 100%">
                        <div>
                            <v-list-item-title class="font-weight-bold body-2">{{user.firstName ? user.firstName : ""}} {{user.lastName ? user.lastName : ""}}</v-list-item-title>
                            <v-list-item-subtitle class="caption mt-1">@{{user.short_id ? user.short_id : ""}}</v-list-item-subtitle>
                        </div>

                        <base-menu>
                            <template v-slot:activator>
                                <v-btn small icon>
                                    <v-icon small>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>

                            <base-card :rounded="0" withoutPadding>
                                <v-list class="pa-0">
                                    <v-list-item
                                        link
                                        dense
                                        :to="`/app/user/${user.short_id ? user.short_id : undefined}`"
                                    >
                                        Profil
                                    </v-list-item>
                                    <v-list-item
                                        link
                                        @click="logout()"
                                        dense
                                    >
                                        Wyloguj
                                    </v-list-item>
                                </v-list>
                            </base-card>
                        </base-menu>
                    </div>
                </v-list-item>
            </v-list>
        </base-card>

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
import {
    mapGetters,
    mapActions,
} from 'vuex';

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
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        ...mapActions(['clearUser']),
        logout() {
            this.clearUser();
            this.$cookies.remove("token");
            this.$router.push("/auth/login");
        }
    },
}
</script>

<style>

</style>