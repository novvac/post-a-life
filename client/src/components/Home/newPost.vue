<template>
    <base-card
        :disabled="loading"
        :loading="loading"
        class="new-post"
    >
        <template v-slot:title>
            Post something
        </template>

        <template v-slot:action>
            <v-btn small text class="text-none caption" @click="toggleVisibility()">
                <v-icon x-small class="mr-1">mdi-{{visibility.icon}}</v-icon>
                {{visibility.text}}
            </v-btn>
        </template>

        <v-list class="pa-0">
            <v-list-item class="pa-0 d-flex align-start justify-start">
                <v-avatar>
                    <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"></v-img>
                </v-avatar>

                <v-textarea
                    solo
                    flat
                    class="ml-2"
                    dense
                    rows="1"
                    placeholder="What's on your mind?"
                    v-model="payload.mind"
                    :hide-details="!Boolean(errors.mind)"
                    :error="Boolean(errors.mind)"
                    :error-messages="errors.mind"
                />

                <v-btn icon large color="success" @click="addPost()">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-list-item>
        </v-list>

        <base-snackbar
            v-model="snackbar"
            timeout="3000"
            color="success"
            fixed
            top
            right
        >
            <v-row class="ma-0" align="center" justify="space-between">
                <div>
                    Post został dodany!
                </div>

                <v-btn icon @click="snackbar = !snackbar">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            </v-row>
        </base-snackbar>
    </base-card>
</template>

<script>
import {
    mapGetters,
    mapMutations,
} from 'vuex';

export default {
    name: "NewPost",
    data() {
        return {
            loading: false,
            payload: {},
            errors: {},
            snackbar: false,
            visibility: {icon: "account-multiple", text: "Tylko znajomi", code: 1},
        }
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        ...mapMutations(['LOGOUT']),
        addPost() {
            this.loading = true;
            this.errors = {};
            this.snackbar = false;

            this.payload.visibility = this.visibility.code;

            this.$http.post("http://192.168.43.5:3000/api/post/", this.payload)
                .then(res => {
                    this.snackbar = true;
                    this.loading = false;
                    this.payload = {};
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();
                    this.errors = err.response.data.errors;
                    
                    this.payload = {};
                    this.loading = false;
                })
        },
        toggleVisibility() {
            if(this.visibility.code === 1)
                this.visibility = {icon: "web", text: "Publiczny", code: 0};
            else
                this.visibility = {icon: "account-multiple", text: "Tylko znajomi", code: 1}
        }
    }
}
</script>

<style>
</style>