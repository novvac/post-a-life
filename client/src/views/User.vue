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
                    <!-- FRIEND BUTTON MECHANISM -->
                    <base-menu>
                        <template v-slot:activator>
                            <v-btn 
                                text 
                                class="caption text-capitalize elevation-0"
                                :color="loadedUser.friendStatus.status != 'N' ? 'primary' : undefined"
                                @click="loadedUser.friendStatus.options.length === 0 ? invitationManager('ADD') : undefined"
                            >
                                <v-icon class="mr-2" small>mdi-{{loadedUser.friendStatus.icon}}</v-icon>
                                {{loadedUser.friendStatus.text}}
                            </v-btn>
                        </template>

                        <base-card without-padding v-if="loadedUser.friendStatus.options">
                            <v-list class="pa-0" dense>
                                <v-list-item
                                    v-for="option in loadedUser.friendStatus.options"
                                    :key="option.icon"
                                    link
                                    @click="invitationManager(option.mutation)"
                                >
                                    <v-icon small class="mr-2">mdi-{{option.icon}}</v-icon>
                                    <span class="caption">{{option.text}}</span>
                                </v-list-item>
                            </v-list>
                        </base-card>
                    </base-menu>
                    <!-- END FRIEND BUTTON MECHANISM -->

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
    mapGetters,
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
        userEndpoint() {
            return this.$http.get("http://192.168.43.5:3000/api/user/" + this.id);
        },
        friendStatusEndpoint() {
            return this.$http.get("http://192.168.43.5:3000/api/user/relation/" + this.id);
        },
        loadUser() {
            this.msg = null;
            this.loadedUser = {},
            this.loading = true;

            this.$http.all([
                this.userEndpoint(),
                this.friendStatusEndpoint(),
            ])
                .then(this.$http.spread((loadedUser, friendStatus) => {
                    this.loadedUser = loadedUser.data;
                    this.setFriendStatus(friendStatus.data.status);

                    this.loading = false;
                }))
                .catch(err => {
                    if(err.response.status === 401) {
                        if(this.$cookies.get("token"))
                            this.$cookies.remove("token");
                        this.$router.push("/auth/login");
                    }

                    this.msg = err.response.data.error.details;
                    this.loading = false;
                })
        },
        setOptions(opts, icon, text) {
            this.loadedUser.friendStatus.icon = icon;
            this.loadedUser.friendStatus.text = text;
            this.loadedUser.friendStatus.options = opts;
        },
        setFriendStatus(status) {
            this.loadedUser.friendStatus = {status: status}
            if(status === "F") {
                this.setOptions([
                    {icon: "account-minus", text: "Usuń ze znajomych", mutation: 'DESTROY'}
                ], "account-multiple", "Jesteście znajomymi")
            } else if(status === "P") {
                this.setOptions([
                    {icon: "undo", text: "Cofnij wysyłanie zaproszenia", mutation: 'DESTROY'},
                ], "check", "Wysłano zaproszenie")
            } else if(status === "R") {
                this.setOptions([
                    {icon: "check", text: "Zaakceptuj", mutation: 'SET'},
                    {icon: "delete", text: "Usuń zaproszenie", mutation: 'DESTROY'},
                ], "account-alert", "Otrzymano zaproszenie")
            } else {
                this.setOptions([], "account-plus", "Dodaj do znajomych");    // this must be empty
            }
        },
        invitationManager(mutation) {
            let url = "http://192.168.43.5:3000/api/user/relation/";
            this.$http.put(url, {id: this.id, mutation: mutation})
                .then(res => {
                    // TODO: DELETE LOAD USER FROM HERE and reload only friend status button
                    this.loadUser();
                })
                .catch(err => {
                    // TODO: make error message
                    //console.log(err);
                })
        }
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