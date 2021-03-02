<template>
    <div class="chat ma-5" style="height: calc(100% - 40px)">
        <span v-if="chat">
            <base-card height="100%">
                <template v-slot:title>
                    <v-row class="ma-0" align="center">
                        <v-avatar size="36" class="mr-2">
                            <v-img :src="'http://192.168.43.5:3000/uploads/' + chat.user.avatar"></v-img>
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
                    <v-progress-circular
                        color="primary"
                        indeterminate
                        v-if="loading"
                    />

                    <div class="messages d-flex flex-column-reverse" v-show="messages.length > 0">
                        <div
                            v-for="msg in messages"
                            :key="msg.createdAt"
                            :class="['message', msg.sender._id === user._id ? 'sender' : undefined]"
                        >
                            <v-avatar size="32">
                                <v-img v-if="msg.sender._id !== user._id" :src="'http://192.168.43.5:3000/uploads/' + chat.user.avatar"></v-img>
                                <v-img v-else :src="'http://192.168.43.5:3000/uploads/' + msg.sender.avatar"></v-img>
                            </v-avatar>
                            
                            <div class="msg">{{msg.text}}</div>
                        </div>

                        <v-btn text class="ma-5" color="primary" @click="loadChat" v-if="!end" :disabled="loading" :loading="loading">
                            Załaduj więcej
                        </v-btn>
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

        <base-card v-else>
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
            messages: [],
            message: "",
            end: false
        }
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        ...mapGetters(['user']),
        ...mapGetters(['friends']),
        ...mapGetters(['newMessage'])
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['RESET_NEW_MESSAGE']),
        async loadChat(type) {
            this.loading = true;
            let limit = 12;

            await this.$http.get(`user/${this.id}/messages/${this.messages.length}-${limit}`)
                .then(res => {
                    if(this.friends.includes(res.data.user._id)) {
                        if(!this.chat)
                            this.chat = {};
                        this.chat.user = res.data.user;

                        if(res.data.messages.length < limit)
                            this.end = true;

                        this.messages = this.messages.concat(res.data.messages);
                        this.RESET_NEW_MESSAGE();
                    }
                    this.loading = false;
                })
                .catch(err => {
                    if(err.response) {
                        if(err.response.status === 401)
                            this.LOGOUT();
                    }
                    
                    console.log(err);
                    this.loading = false;
                })
        },
        sendMessage() {
            if(this.message.length > 0) {
                this.$http.post(`user/${this.id}/message/`, {
                    message: this.message
                })
                    .then(res => {
                        let obj = {
                            readed: false,
                            sender: {
                                avatar: this.user.avatar,
                                _id: this.user._id
                            },
                            recipient: this.chat.user._id,
                            text: this.message
                        }
                        this.messages.unshift(obj);

                        this.message = "";
                        document.querySelector(".messages").scroll(0,0);
                    })
                    .catch(err => {
                        if(err.response) {
                            if(err.reponse.status === 401)
                                this.LOGOUT();
                        }

                        console.log(err);
                    })
            }
        },
        loadNewMessage() {
            this.$http.get(`user/${this.id}/messages/0-1`)
                .then(res => {
                    this.messages.unshift(res.data.messages[0]);
                    document.querySelector(".messages").scroll(0,0);

                    this.RESET_NEW_MESSAGE();
                })
                .catch(err => {
                    if(err.response) {
                        if(err.response.status === 401)
                            this.LOGOUT();
                    }
                    
                    console.log(err);
                })
        }
    },
    created() {
        this.loadChat();
    },
    watch: {
        $route(to, from) {
            this.messages = [];
            this.chat = null;
            this.loadChat();
        },
        newMessage() {
            if(this.newMessage === true) {
                this.loadNewMessage();
            }
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

        .message {
            display: flex;
            align-items: center;
            margin: 8px;

            .msg {
                margin-left: 12px;
            }
            &.sender {
                flex-direction: row-reverse;
                
                .msg {
                    margin-left: 0;
                    margin-right: 12px;
                }
            }
        }
    }
}
</style>