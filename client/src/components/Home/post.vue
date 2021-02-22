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
                        {{createdAt}}
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
            <v-btn tile text class="caption text-capitalize py-6" :disabled="comments.loading" @click="toggleComments()">
                <v-icon small class="mr-2">mdi-comment-outline</v-icon>
                <b class="mr-1">{{feed.comments.length}}</b> Komentarze
            </v-btn>
        </v-card-actions>

        <v-divider/>

        <div class="comments">
            <!-- ładowanie kolejnych komentarzy -->
            <comment
                v-for="cmt in comments.list"
                :key="cmt._id"
                :comment="cmt"
            />
        </div>

        <v-row class="ma-0 mx-5 mb-3 caption" justify="start" align="center" v-if="comments.list.length > 0">
            <v-btn text class="caption text-none grey lighten-3" small @click="loadComments()" v-if="moreComments">
                Pokaż wcześniejsze
            </v-btn>

            <v-spacer></v-spacer>

            <p class="ma-0">{{comments.list.length}} z {{feed.comments.length}}</p>
        </v-row>

        <v-divider class="mt-4" v-if="comments.list.length > 0 || comments.loading"/>

        <div class="pa-4 d-flex align-center">
            <v-avatar size="36">
                <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"></v-img>
            </v-avatar>

            <v-text-field
                outlined
                rounded
                placeholder="Napisz komentarz..."
                dense
                class="ml-2 caption"
                append-icon="mdi-face"
                @keyup.enter="addComment()"
                v-model="comment"
                :hide-details="!Boolean(errors.comment)"
                :error="Boolean(errors.comment)"
                :error-messages="errors.comment"
                :loading="commentLoading"
                :disabled="commentLoading"
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
    components: {
        Comment: () => import("@/components/Home/comment.vue"),
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
                list: []
            },
            comment: "",
            errors: {},
            commentLoading: false,
        }
    },
    computed: {
        ...mapGetters(['user']),
        createdAt() { 
            const loadedTimestamp = new Date();
            this.comments.timestamp = loadedTimestamp.getTime();

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
        },
        moreComments() {
            if(this.comments.list.length < this.feed.comments.length &&
                this.comments.list.length > 0)
                return true;
            else
                return false;
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
        },
        addComment() {
            this.errors = {};
            this.commentLoading = true;
            const url = "http://192.168.43.5:3000/api/post/" + this.feed._id + "/comment/";
            this.$http.post(url, {comment: this.comment})
                .then(res => {
                    this.commentLoading = false;
                    this.comment = "";
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.errors = err.response.data.errors;
                    this.commentLoading = false;
                    this.comment = "";
                })
        },
        loadComments() {
            this.comments.loading = true;
            this.$http.post(`http://192.168.43.5:3000/api/post/${this.feed._id}/comments`, {
                timestamp: this.comments.timestamp,
                skip: this.comments.skip,
                limit: this.comments.limit,
            })
                .then(res => {
                    this.comments.list = this.comments.list.concat(res.data.comments);
                    this.comments.skip += this.comments.limit;
                    this.comments.loading = false;
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
            if(this.feed.comments.length > 0) {
                if(this.comments.list.length > 0) {
                    this.comments.list = [];
                } else {
                    this.comments.skip = 0;
                    this.loadComments();
                }
            }
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