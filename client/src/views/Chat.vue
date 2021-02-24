<template>
    <div class="chat ma-5" style="height: calc(100% - 40px)">
        <span v-if="!loading && chat">
            <base-card height="100%">
                <template v-slot:title>
                    <v-avatar size="28" class="mr-2">
                        <v-img src="http://192.168.43.5:3000/uploads/default-avatar.png"></v-img>
                    </v-avatar>
                        
                    <span>Jan Kowalski</span>
                </template>

                <template v-slot:action>
                    <v-btn icon>
                        <v-icon small>mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>

                <div class="d-flex flex-column justify-space-between" style="height: 100%">
                    <div class="messages d-flex flex-column-reverse">
                        <div class="message d-flex">
                            <v-avatar size="36">
                                <v-img src="http://192.168.43.5:3000/uploads/default-avatar.png"></v-img>
                            </v-avatar>

                            <div class="ml-3 body-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta nisi, odit molestiae explicabo laborum reiciendis dolorum, qui doloremque dolorem mollitia velit dolore fuga sit. Earum ad quis nisi quisquam repudiandae?</div>
                        </div>
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
                        @click.enter="sendMessage()"
                    />
                </div>
            </base-card>
        </span>

        <base-card v-if="loading || !chat">
            <v-progress-circular
                color="primary"
                indeterminate
                v-if="loading"
            />

            <div class="d-flex align-center justify-space-between" v-if="!loading && !chat">
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
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        loadChat() {
            this.chat = null;
            this.loading = false;
            this.$http.get(`http://192.168.43.5:3000/api/message/user/${this.id}/messages/`)
                .then(res => {
                    console.log(res);
                    this.chat = {
                        test: "test"
                    };
                })
                .catch(err => {
                    if(err.response.status === 401)
                        this.LOGOUT();
                    
                    console.log(err);
                })
        },
        sendMessage() {

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