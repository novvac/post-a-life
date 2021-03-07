<template>
    <div class="home pa-5">       
        <v-row class="ma-0">
            <v-col cols="12">
                <new-post class="mb-6"/>

                <infinite-scroll id="none" :visibility="1"/>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
} from 'vuex';

export default {
    name: "Home",
    components: {
        NewPost: () => import('@/components/Home/newPost'),
        InfiniteScroll: () => import("@/components/infiniteScroll"),
    },
    computed: {
        ...mapGetters(['friends']),
    },
}
</script>

<style>

</style>