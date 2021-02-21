<template>
    <base-card class="post" without-padding>
        <template v-slot:title>
            <div class="d-flex align-center">
                <v-avatar size="36">
                    <v-img :src="'http://192.168.43.5:3000/uploads/' + feed.owner.avatar"></v-img>
                </v-avatar>

                <div class="ml-2">
                    <router-link :to="'/app/user/' + feed.owner.short_id" class="d-block">
                        {{feed.owner.firstName}} {{feed.owner.lastName}}
                    </router-link>
                    <p class="ma-0 font-weight-normal caption grey--text">
                        {{created}}
                    </p>
                </div>
            </div>
        </template>

        <template v-slot:action>
            <v-btn small icon>
                <v-icon small>mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>

        <p class="body-2 ma-0 my-5 black--textm mx-5">
            {{feed.mind}}
        </p>

        <v-divider></v-divider>

        <v-card-actions class="pa-0 flexmn">
            <v-btn tile text class="caption text-capitalize py-6" @click="addLike">
                <v-icon small class="mr-2" color="red" v-if="feed.likes.includes(user._id)">mdi-heart</v-icon>
                <v-icon small class="mr-2" v-else>mdi-heart-outline</v-icon>
                <b class="mr-1">{{feed.likes.length}}</b> Polubień
            </v-btn>
            <v-btn tile text class="caption text-capitalize py-6">
                <v-icon small class="mr-2">mdi-comment-outline</v-icon>
                <b class="mr-1">{{feed.comments.length}}</b> Komentarze
            </v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <div class="pa-4 d-flex align-center">
            <v-avatar size="36">
                <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"></v-img>
            </v-avatar>

            <v-text-field
                outlined
                rounded
                placeholder="Napisz komentarz..."
                dense
                hide-details
                class="ml-2 caption"
                append-icon="mdi-face"
            />
        </div>

        <base-snackbar v-model="snackbar" color="red" fixed top right>
            <v-row class="ma-0" align="center" justify="space-between">
                <div>
                    {{error}}
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
    mapActions
} from 'vuex';

export default {
    name: "Post",
    props: {
        feed: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            snackbar: false,
            error: "",
        }
    },
    computed: {
        ...mapGetters(['user']),
        created() {
            const dt = new Date(this.feed.createdAt);

            let date = dt.getDate();
            date = date < 10 ? '0'+date : date;

            let month = dt.getMonth()+1;
            month = month < 10 ? '0'+month : month;

            let minutes = dt.getMinutes();
            minutes = minutes < 10 ? '0'+minutes : minutes;

            let hours = dt.getHours();
            hours = hours < 10 ? '0'+hours : hours;

            return `${date}-${month}-${dt.getFullYear()}  |  ${hours}:${minutes}`;
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        addLike() {
            const url = "http://192.168.43.5:3000/api/post/" + this.feed._id + "/like/";
            this.$http.put(url)
                .then(res => {
                    if(res.data.added) {
                        this.feed.likes.push(this.user._id);
                    } else {
                        this.feed.likes.splice(this.feed.likes.indexOf(this.user._id), 1);
                    }
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.error = err.response.data.error;
                    this.snackbar = true;
                })
        }
    }
}
</script>

<style lang="scss">
.post {
    a {
        color: black;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
}
</style>