<template>
    <div class="home pa-5">       
        <v-row class="ma-0">
            <v-col cols="12" :md="8">
                <new-post/>

                <div>
                    <post
                        v-for="feed in feeds"
                        :key="feed.id"
                        :feed="feed"
                        class="mt-4"
                    />
                </div>

                <v-skeleton-loader
                    type="card-avatar"
                    style="border-radius: 16px !important;"
                    loading
                    class="mt-4"
                    v-if="loading"
                ></v-skeleton-loader>

                <v-btn @click="loadPosts()">load</v-btn>

                <div class="text-center mt-5 caption" v-if="end">
                    <v-divider class="mb-5"></v-divider>
                    <b>Załadowano już wszystkie posty!</b> Odśwież stronę!
                </div>
            </v-col>
            <v-col cols="12" :md="4">
                <stories class="mb-5"/>
                <events/>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    name: "Home",
    components: {
        NewPost: () => import('@/components/Home/newPost'),
        Stories: () => import('@/components/Home/stories'),
        Events: () => import('@/components/Home/events'),
        Post: () => import("@/components/Home/post"),
    },
    data() {
        return {
            feeds: [],
            loading: false,
            timestamp: 0,
            skip: 0,
            limit: 5,
            end: false,
        }
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        loadPosts() {
            if(this.timestamp === 0) {
                let dt = new Date();
                this.timestamp = dt.getTime();
            }

            console.log(this.user.friends);

            this.loading = true;
            this.$http.post("http://192.168.43.5:3000/api/post/posts/", {
                ids: this.user.friends,
                timestamp: this.timestamp,
                skip: this.skip,
                limit: this.limit,
            })
                .then(res => {
                    if(res.data.posts.length < this.limit)
                        this.end = true;

                    this.feeds = this.feeds.concat(res.data.posts);
                    console.log(this.feeds);
                    this.loading = false;
                    this.skip += 5;
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();
                    
                    console.log(err);
                })
        }
    },
    created() {
        this.loadPosts();
    }
}
</script>

<style>

</style>