<template>
    <div class="chat ma-5">
        <base-card v-if="!loading && chat" height="100%">
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

            <span>xd</span>

            <v-divider class="mb-5 mt-4"></v-divider>

            <v-text-field
                outlined
                :autocomplete="false"
                placeholder="Wyślij wiadomość..."
                dense
                class="caption"
                append-icon="mdi-face"
                hide-details
                v-model="message"
            />
        </base-card>

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
export default {
    name: "Chat",
    data() {
        return {
            loading: false,
            chat: {},
            message: "",
        }
    },
    methods: {
        loadChat() {
            this.loading = false;
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
    a {
        text-decoration: none;
    }
}
</style>