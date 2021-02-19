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

                <!-- <v-skeleton-loader
                    type="card-avatar"
                    style="border-radius: 16px !important;"
                    loading
                    class="mt-4"
                ></v-skeleton-loader> -->
            </v-col>
            <v-col cols="12" :md="4">
                <stories class="mb-5"/>
                <events/>
            </v-col>
        </v-row>
    </div>
</template>

<script>
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
            feeds: []
        }
    },
}
</script>

<style>

</style>