<template>
    <div class="chat ma-5" style="height: calc(100% - 40px)">
        <base-card v-if="loading">
            <v-progress-circular
                color="primary"
                indeterminate
            />
        </base-card>



        <span v-if="!loading && chat">
            <base-card height="100%">
                <template v-slot:title>
                    <v-row class="ma-0" align="center">
                        <v-avatar size="36" class="mr-2">
                            <v-img src="http://192.168.43.5:3000/uploads/default-avatar.png"></v-img>
                        </v-avatar>
                            
                        <div class="d-flex flex-column">
                            <span>{{chat.user.firstName}} {{chat.user.lastName}}</span>
                            <span class="caption success--text">Aktywny teraz</span>
                        </div>
                    </v-row>
                </template>

                <template v-slot:action>
                    <v-btn icon>
                        <v-icon small>mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>

                <div class="d-flex flex-column justify-space-between" style="height: 100%">
                    <div class="messages d-flex flex-column-reverse">
                        <!-- Messages -->
                    </div>

                    <v-text-field
                        outlined
                        :autocomplete="false"
                        placeholder="Wyślij wiadomość..."
                        dense
                        class="caption mt-5"
                        append-icon="mdi-face"
                        hide-details
                        v-model="message"
                        style="flex: none;"
                        @keyup.enter="sendMessage()"
                    />
                </div>
            </base-card>
        </span>

        <base-card v-if="!loading && !chat">
            <div class="d-flex align-center justify-space-between">
                <span>Nie możesz rozpocząć konwersacji z wybranym użytkownikiem!</span>

                <router-link to="/app">
                    <v-btn text small class="caption text-none">
                        <v-icon small class="mr-1">mdi-home</v-icon>
                        Strona główna
                    </v-btn>
                </router-link>
            </div>
        </base-card>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    name: "Chat",
    data() {
        return {
            loading: false,
            chat: null,
            message: "",
        }
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        ...mapGetters(['friends']),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        loadChat() {
            this.chat = null;
            this.loading = true;
            this.$http.get(`http://192.168.43.5:3000/api/user/${this.id}/messages/`)
                .then(res => {
                    if(this.friends.includes(res.data.user._id)) {
                        this.chat = {};
                        this.chat.user = res.data.user;

                        this.chat.messages = res.data.messages;
                        console.log(this.chat)
                    }
                    this.loading = false;
                })
                .catch(err => {
                    if(err.response.status === 401)
                        this.LOGOUT();
                    
                    console.log(err);
                    this.loading = false;
                })
        },
        sendMessage() {
            if(this.message.length > 0) {
                this.$http.post(`http://192.168.43.5:3000/api/user/${this.id}/message/`, {
                    message: this.message
                })
                    .then(res => {
                        this.message = "";
                    })
                    .catch(err => {
                        if(err.response) {
                            if(err.reponse.status === 401)
                                this.LOGOUT();
                        }

                        console.log(err);
                    })
            }
        }
    },
    created() {
        this.loadChat();
    },
    watch: {
        $route(to, from) {
            this.loadChat();
        }
    }
}
</script>

<style lang="scss">
.chat {
    max-height: calc(100vh - 104px);
    a {
        text-decoration: none;
    }

    .v-card__text {
        height: calc(100% - 68px)
    }

    .messages {
        height: 100%;
        max-height: 100%;
        overflow-y: scroll;
    }
}
</style>