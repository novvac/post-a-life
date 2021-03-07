<template>
    <div class="posts">
        <component
            :is="component"
            v-for="feed in feeds"
            :key="feed.id"
            :data="feed"
            class="mb-4 infinite-el"
            v-bind="$attrs"
        />

        <div v-if="loading">
            <v-skeleton-loader
                type="card-avatar"
                style="border-radius: 16px !important;"
                loading
                class="mb-4"
                v-for="i in 2"
                :key="i"
            />
        </div>

        <div class="text-center mt-5 caption" v-if="end || max">
            <v-divider class="mb-5"></v-divider>
            <span v-if="feeds.length == 0"><b>Nie znaleziono żadnych postów</b> Sprawdź później!</span>
            <span v-else-if="end"><b>Wszystko zostało załadowane!</b> Sprawdź później!</span>
            <span v-else-if="max"><b>Załadowano maksymalną ilość postów.</b> Odśwież stronę!</span>
        </div>
    </div>
</template>

<script>
import {
    mapActions
} from 'vuex';

export default {
    name: "Posts",
    props: {
        visibility: {
            type: Number,
            default: 0,
        },
        component: {
            type: String,
            default: 'post'
        },
        endpoint: {
            type: String,
            default: 'post',
        },
        id: {
            type: String,
            default: "none",
        }
    },
    components: {
        Post: () => import("@/components/Home/post"),
        EventInline: () => import('@/components/Events/inline')
    },
    data() {
        return {
            feeds: [],
            loading: false,
            timestamp: 0,
            skip: 0,
            limit: 4,
            end: false,
            max: false,
            maxFeeds: 50,
            loadNow: false,
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        loadPosts() {
            if(this.timestamp === 0) {
                let dt = new Date();
                this.timestamp = dt.getTime();
            }

            this.loading = true;
            const computedURL = `${this.endpoint}/${this.id}/${this.skip}-${this.limit}-${this.visibility}-${this.timestamp}`
            this.$http.get(computedURL)
                .then(res => {
                    if(res.data.length < this.limit)
                        this.end = true;

                    if(res.data.length > 0)
                        document.addEventListener("scroll", this.handleScroll);

                    this.feeds = this.feeds.concat(res.data);
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
            let rect = document.querySelectorAll(".infinite-el")[document.querySelectorAll(".infinite-el").length - 1].getBoundingClientRect();

            if(
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                !this.loadNow
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