<template>
    <div class="home pa-5">       
        <v-row class="ma-0">
            <v-col cols="12" :md="8">
                <new-post/>

                <post
                    v-for="feed in feeds"
                    :key="feed.id"
                    :feed="feed"
                    class="mt-4"
                />

                <div v-if="loading">
                    <v-skeleton-loader
                        type="card-avatar"
                        style="border-radius: 16px !important;"
                        loading
                        class="mt-4"
                        v-for="i in 2"
                        :key="i"
                    />
                </div>

                <div class="text-center mt-5 caption" v-if="end || max">
                    <v-divider class="mb-5"></v-divider>
                    <span v-if="end"><b>Załadowano już wszystkie posty!</b> Odśwież stronę!</span>
                    <span v-else-if="max"><b>Załadowano maksymalną ilość postów.</b> Odśwież stronę!</span>
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
            limit: 6,
            end: false,
            max: false,
            maxFeeds: 75,
            loadNow: false,
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

                    document.addEventListener("scroll", this.handleScroll);

                    this.feeds = this.feeds.concat(res.data.posts);
                    this.loading = false;
                    this.skip += this.limit;
                    this.loadNow = false;
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();
                    
                    console.log(err);
                })
        },
        handleScroll() {
            let rect = document.querySelectorAll(".post")[document.querySelectorAll(".post").length - 1].getBoundingClientRect();

            if(
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                this.loadNow === false
            ) {
                this.loadNow = true;
            }
        }
    },
    created() {
        this.loadPosts();
    },
    destroyed() {
        document.removeEventListener("scroll", this.handleScroll);
    },
    watch: {
        feeds() {
            if(this.feeds.length > this.maxFeeds) {
                this.feeds = this.feeds.slice(0, this.maxFeeds);
                this.max = true;
            }
        },
        loadNow() {
            if(this.loadNow && !this.end && !this.max) {
                this.loadPosts();
            }
        }
    }
}
</script>

<style>

</style>