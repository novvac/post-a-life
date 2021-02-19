<template>
    <base-card
        :disabled="loading"
        :loading="loading"
    >
        <template v-slot:title>
            Post something
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

            this.$http.post("http://192.168.43.5:3000/api/post/", this.payload)
                .then(res => {
                    this.snackbar = true;
                    this.loading = false;
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();
                    this.errors = err.response.data.errors;
                        
                    this.loading = false;
                })
        }
    }
}
</script>

<style>

</style>