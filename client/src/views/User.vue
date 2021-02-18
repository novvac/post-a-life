<template>
    <div class="user ma-5">
        <base-card v-if="loading" style="height: 100%">
            <v-progress-circular
                indeterminate
                class="mr-3"
                color="primary"
            />

            Ładowanie danych...
        </base-card>

        <base-card without-padding v-else-if="!loading && !msg">
            <profile-banner :owner="id === user.short_id ? true : false" :src="'http://192.168.43.5:3000/uploads/' + loadedUser.banner"/>
            <avatar :owner="id === user.short_id ? true : false" :src="'http://192.168.43.5:3000/uploads/' + loadedUser.avatar"/>
        
            <div>
                <p class="ma-0 text-center mt-4 title black--text">{{loadedUser.firstName}} {{loadedUser.lastName}}</p>
                <p class="ma-0 text-center caption">{{loadedUser.short_id}}</p>
            </div>

            <v-divider class="mt-5"></v-divider>
            <v-row class="ma-0 mx-5 my-3" align="center">
                <div v-if="id != user.short_id" class="d-flex">
                    <v-btn text class="caption text-capitalize elevation-0 ml-2">
                        <v-icon class="mr-2" small>mdi-account-plus</v-icon>
                        Dodaj do znajomych
                    </v-btn>

                    <v-btn text class="caption text-capitalize elevation-0 ml-2">
                        <v-icon class="mr-2" small>mdi-message</v-icon>
                        Wyślij wiadomość
                    </v-btn>
                </div>

                <v-spacer></v-spacer>

                <v-btn class="caption text-capitalize elevation-0" v-if="id === user.short_id">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>

                <v-btn class="caption text-capitalize elevation-0 ml-2">
                    <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-row>
            <v-divider></v-divider>

            <v-row class="ma-0 pa-5">
                here we go
            </v-row>
        </base-card>

        <base-card v-else>
            {{msg}}
        </base-card>   
    </div>
</template>

<script>
import {
  mapActions,
    mapGetters, mapMutations,
} from 'vuex';

export default {
    name: "User",
    data() {
        return {
            loading: false,
            loadedUser: null,
            msg: null,
        }
    },
    computed: {
        ...mapGetters(['user']),
        id() {
            return this.$route.params.id;
        },
    },
    components: {
        profileBanner: () => import('@/components/User/profileBanner'),
        avatar: () => import("@/components/User/avatar"),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        loadUser() {
            this.msg = null;
            this.loadedUser = {},
            this.loading = true;

            this.$http.all([
                this.$http.get("http://192.168.43.5:3000/api/user/" + this.id),
            ])
                .then(this.$http.spread((loadedUser) => {
                    this.loadedUser = loadedUser.data;
                    this.loading = false;
                }))
                .catch(err => {
                    this.msg = "Nie udało się załadować użytkownika! Prosimy o kontakt!";
                    if(err.response.status === 401)
                        this.LOGOUT();
                    else if(err.response.status === 404)
                        this.msg = "Użytkownik nie istnieje!";
                        
                    this.loading = false;
                })
        },
    },
    created() {
        this.loadUser();
    },
    watch: {
        $route(to, from) {
            this.loadUser();
        },
    }
}
</script>

<style>

</style>