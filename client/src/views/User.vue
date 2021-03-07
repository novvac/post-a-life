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
            <profile-banner :owner="id === user.short_id ? true : false" :src="loadedUser.banner"/>
            <avatar :owner="id === user.short_id ? true : false" :src="loadedUser.avatar"/>

            <div>
                <p class="ma-0 text-center mt-4 title black--text">{{loadedUser.firstName}} {{loadedUser.lastName}}</p>
                <p class="ma-0 text-center caption">{{loadedUser.short_id}}</p>
            </div>

            <v-divider class="mt-5"></v-divider>
            <v-row class="ma-0 mx-5 my-3" align="center">
                <div v-if="id != user.short_id" class="d-flex">
                    <base-menu>
                        <template v-slot:activator>
                            <v-btn text class="caption text-capitalize" :color="friendButton.color" @click="loadedUser.friendStatus === 0 ? invitationManager('post') : ''">
                                <v-icon class="mr-2" small>mdi-{{friendButton.icon}}</v-icon>
                                {{friendButton.text}}
                            </v-btn>
                        </template>

                        <base-card without-padding>
                            <v-list dense class="pa-0 caption">
                                <v-list-item
                                    v-for="item in friendButton.options"
                                    :key="item.icon"
                                    link
                                    @click="invitationManager(item.action)"
                                >
                                    <v-icon small class="mr-2">mdi-{{item.icon}}</v-icon>
                                    {{item.text}}
                                </v-list-item>
                            </v-list>
                        </base-card>
                    </base-menu>

                    <router-link :to="'/app/chat/' + loadedUser.short_id" v-if="loadedUser.friendStatus === 1">
                        <v-btn text class="caption text-capitalize ml-2">
                            <v-icon class="mr-2" small>mdi-message</v-icon>
                            Wyślij wiadomość
                        </v-btn>
                    </router-link>
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
                <v-col cols="12" :md="4" class="py-0 pl-0">
                    <base-card bordered :rounded="0" without-padding style="overflow: hidden;">
                        <template v-slot:title>
                            Nawigacja
                        </template>

                        <v-tabs vertical v-model="tab" grow>
                            <v-tab
                                class="justify-start"
                                v-for="t in tabs"
                                :key="t.icon"
                            >
                                <v-icon class="mr-2 black--text" small>mdi-{{t.icon}}</v-icon>
                                <span class="body-2 text-none">{{t.text}}</span>
                            </v-tab>
                        </v-tabs>
                    </base-card>
                </v-col>

                <v-col cols="12" :md="8" class="pa-0">
                    <v-tabs-items v-model="tab">
                        <v-tab-item
                            v-for="t in tabs"
                            :key="t.text"
                            transition="fade-transition"
                        >
                            <component :id="id" v-bind="t.data" :is="t.component" bordered/>
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
        </base-card>

        <base-card v-else>
            {{msg}}
        </base-card>

        <base-snackbar
            v-model="userSnackbar.dialog"
            timeout="3000"
            :color="userSnackbar.color"
            fixed
            top
            right
        >
            <v-row class="ma-0" align="center" justify="space-between">
                <div>
                    {{userSnackbar.msg}}
                </div>

                <v-btn icon @click="SET_USER_SNACKBAR({dialog: false, msg: null, color: null})">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            </v-row>
        </base-snackbar>
    </div>
</template>

<script>
import {
    mapActions,
    mapGetters,
} from 'vuex';

export default {
    name: "User",
    data() {
        return {
            loading: false,
            loadedUser: null,
            msg: null,
            friendButton: {},
            tab: null,
            tabs: [
                {icon: "folder-outline", text: "Posty", component: "infinite-scroll", data: {
                    visibility: 0,
                }},
                {icon: "calendar", text: "Wydarzenia", component: "infinite-scroll", data: {
                    endpoint: 'event',
                    component: 'event-inline'
                }}
            ]
        }
    },
    computed: {
        ...mapGetters(['user']),
        ...mapGetters(['userSnackbar']),
        id() {
            return this.$route.params.id;
        },
    },
    components: {
        profileBanner: () => import('@/components/User/profileBanner'),
        avatar: () => import("@/components/User/avatar"),
        newPost: () => import("@/components/Home/newPost"),

        infiniteScroll: () => import('@/components/infiniteScroll'),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['INVITATION_MANAGER']),
        ...mapActions(['SET_USER_SNACKBAR']),
        loadUser() {
            this.msg = null;
            this.loadedUser = {},
            this.loading = true;

            this.$http.all([
                this.$http.get("user/id/" + this.id),
                this.$http.get("user/friend/" + this.id),
            ])
                .then(this.$http.spread((loadedUser, friendStatus) => {
                    this.loadedUser = loadedUser.data;
                    this.loadedUser.friendStatus = friendStatus.data.status;

                    this.setFriendButton();

                    if(friendStatus.data.status != 1)
                        this.tabs[0].data.visibility = 0;
                    else
                        this.tabs[0].data.visibility = friendStatus.data.status;

                    if(this.user.short_id === this.id)
                        this.tabs[0].data.visibility = 1;

                    this.loading = false;
                }))
                .catch(err => {
                    this.msg = "Nie udało się załadować użytkownika! Prosimy o kontakt!";
                    if(err.response) {
                        if(err.response.status === 401)
                            this.LOGOUT();
                        else if(err.response.status === 404)
                            this.msg = "Użytkownik nie istnieje!";
                    }
                        
                    this.loading = false;
                })
        },
        setFriendButton() {
            const status = this.loadedUser.friendStatus;

            if(status === 1) {            // ! friends
                this.friendButton = {icon: "account-multiple", color: "primary", text: "Jesteście znajomymi!"};
                this.friendButton.options = [
                    {icon: "account-minus", text: "Usuń ze znajomych", action: "delete"}
                ];
            }
            else if(status === 2) {       // ! pending
                this.friendButton = {icon: "check", color: "primary", text: "Wysłano zaproszenie"};
                this.friendButton.options = [
                    {icon: "undo", text: "Cofnij wysyłanie zaproszenia", action: "delete"}
                ];
            }
            else if(status === 3) {     // ! received
                this.friendButton = {icon: "account-alert", color: "primary", text: "Otrzymano zaproszenie"};
                this.friendButton.options = [
                    {icon: "check", text: "Akceptuj", action: "put"},
                    {icon: "delete", text: "Usuń", action: "delete"},
                ];
            }
            else if(status === 0) {     // ! not friends
                this.friendButton = {icon: "account-plus", color: "", text: "Dodaj do znajomych"};
            }
            else {                                            // ! error
                this.friendButton = {icon: "alert-circle", color: "red", text: "Error"};
            }
        },
        invitationManager(action) {
            this.INVITATION_MANAGER({
                action: action,
                id: this.id,
            }).then(res => {
                this.loadedUser.friendStatus = res;
                this.setFriendButton();
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

<style lang="scss">
.user {
    a {
        text-decoration: none;
    }
}
</style>