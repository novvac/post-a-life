<template>
    <base-card class="post" without-padding v-bind="$attrs">
        <template v-slot:title>
            <div class="d-flex align-center">
                <v-avatar size="36">
                    <v-img :src="'http://192.168.43.5:3000/uploads/' + post.owner.avatar"></v-img>
                </v-avatar>

                <div class="ml-2">
                    <router-link :to="'/app/user/' + post.owner.short_id" class="d-block">
                        {{post.owner.firstName}} {{post.owner.lastName}}
                    </router-link>
                    <p class="ma-0 font-weight-normal caption grey--text">
                        {{createdAt}}
                        <span class="mx-2">•</span>
                        <v-icon x-small v-if="post.visibility == 1">mdi-account-multiple</v-icon>
                        <v-icon x-small v-else-if="post.visibility == 0">mdi-web</v-icon>
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
            {{post.mind}}
        </p>

        <v-divider></v-divider>

        <v-card-actions class="pa-0">
            <v-btn tile text class="caption text-capitalize py-6" @click="addLike">
                <v-icon small class="mr-2" color="red" v-if="post.likes.includes(user._id)">mdi-heart</v-icon>
                <v-icon small class="mr-2" v-else>mdi-heart-outline</v-icon>
                <b class="mr-1">{{post.likes.length}}</b> Polubień
            </v-btn>
            <v-btn tile text class="caption text-capitalize py-6" :disabled="comments.loading" @click="toggleComments()">
                <v-icon small class="mr-2">mdi-comment-outline</v-icon>
                <b class="mr-1">{{post.comments.length}}</b> Komentarze
            </v-btn>
        </v-card-actions>

        <v-divider/>

        <div class="mx-5 mt-3 d-flex flex-column-reverse" v-if="comments.list.length > 0">
            <div
                v-for="comment in comments.list"
                :key="comment.id"
            >
                <discussion
                    :comment="comment"
                    :timestamp="comments.timestamp"
                />
            </div>

            <v-row class="ma-0 mb-2" align="center">
                <v-btn
                    small text
                    class="caption text-none grey lighten-3"
                    v-if="comments.list.length < post.comments.length"
                    @click="loadComments()"
                >
                    Pokaż wcześniejsze
                </v-btn>

                <v-spacer></v-spacer>

                <span>{{comments.list.length}} z {{post.comments.length}}</span>
            </v-row>
        </div>

        <div class=" mx-5 mt-5 d-flex">
            <v-avatar size="36">
                <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"></v-img>
            </v-avatar>

            <v-text-field
                outlined
                rounded
                :autocomplete="false"
                placeholder="Napisz komentarz..."
                dense
                class="ml-2 caption"
                append-icon="mdi-face"
                @keyup.enter="addComment()"
                v-model="newComment.model"
                hint="Kliknięcie przycisku ENTER spowoduje dodanie komentarza!"
                :error="Boolean(errors.comment)"
                :error-messages="errors.comment"
                :loading="newComment.loading"
                :disabled="newComment.loading"
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
        post: {
            type: Object,
            required: true,
        }
    },
    components: {
        Discussion: () => import("@/components/Home/discussion"),
    },
    data() {
        return {
            snackbar: false,
            error: "",
            comments: {
                loading: false,
                limit: 4,
                skip: 0,
                timestamp: 0,
                list: [],
            },
            newComment: {
                model: "",
                loading: false,
            },
            errors: {},
        }
    },
    computed: {
        ...mapGetters(['user']),
        createdAt() { 
            const dt = new Date(this.post.createdAt);

            let date = dt.getDate();
            date = date < 10 ? '0'+date : date;

            let month = dt.getMonth()+1;
            month = month < 10 ? '0'+month : month;

            let minutes = dt.getMinutes();
            minutes = minutes < 10 ? '0'+minutes : minutes;

            let hours = dt.getHours();
            hours = hours < 10 ? '0'+hours : hours;

            return `${date}-${month}-${dt.getFullYear()}  |  ${hours}:${minutes}`;
        },
    },
    methods: {
        ...mapActions(['LOGOUT']),
        addLike() {
            const url = "post/" + this.post._id + "/like/";
            this.$http.put(url)
                .then(res => {
                    if(res.data.added) {
                        this.post.likes.push(this.user._id);
                    } else {
                        this.post.likes.splice(this.post.likes.indexOf(this.user._id), 1);
                    }
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.error = err.response.data.error;
                    this.snackbar = true;
                })
        },
        addComment() {
            this.errors = {};
            this.newComment.loading = true;
            console.log(this.post._id)
            const url = "post/" + this.post._id + "/comment/";
            this.$http.post(url, {comment: this.newComment.model})
                .then(res => {
                    this.newComment.loading = false;
                    this.newComment.model = "";

                    //todo: dodaj komentarz dodany przez użytkownika do listy komentarzy
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.errors = err.response.data.errors;
                    this.newComment.loading = false;
                })
        },
        loadComments() {
            this.comments.loading = true;
            this.$http.post(`post/${this.post._id}/comments`, {
                timestamp: this.comments.timestamp,
                skip: this.comments.skip,
                limit: this.comments.limit,
            })
                .then(res => {
                    if(res.data.comments.length > 0) {
                        this.comments.list = this.comments.list.concat(res.data.comments);
                        this.comments.skip += this.comments.limit;
                        this.comments.loading = false;  
                    }
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.error = "Nie udało się załadować komentarzy!";
                    this.snackbar = true;
                    this.comments.loading = false;
                })
        },
        toggleComments() {
            if(this.post.comments.length > 0) {
                if(this.comments.list.length > 0) {
                    this.comments.list = [];
                } else {
                    this.comments.skip = 0;
                    this.loadComments();
                }
            }
        },
    },
    created() {
        const loadedTimestamp = new Date();
        this.comments.timestamp = loadedTimestamp.getTime();
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