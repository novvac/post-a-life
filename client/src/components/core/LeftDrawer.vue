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
                        <v-img :src="$http.defaults.baseURL + 'uploads/' + user.avatar"></v-img>
                    </v-avatar>

                    <div class="ml-3 d-flex align-center justify-space-between" style="width: 100%">
                        <div>
                            <v-list-item-title class="font-weight-bold body-2">{{user.firstName ? user.firstName : ""}} {{user.lastName ? user.lastName : ""}}</v-list-item-title>
                            <v-list-item-subtitle class="caption mt-1">{{user.short_id ? user.short_id : ""}}</v-list-item-subtitle>
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
                {icon: "home", text: "Strona główna", to: "/app"},
                {icon: "calendar-blank", text: "Wydarzenia", to: "/app/events"},
            ]
        }
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        logout() {
            this.LOGOUT();
        }
    },
}
</script>

<style>

</style>