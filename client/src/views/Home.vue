<template>
    <div class="home pa-5">       
        <v-row class="ma-0">
            <v-col cols="12" :md="8">
                <new-post class="mb-6"/>

                <posts :ids="user.friends" :visibility="1"/>
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
} from 'vuex';

export default {
    name: "Home",
    components: {
        NewPost: () => import('@/components/Home/newPost'),
        Stories: () => import('@/components/Home/stories'),
        Events: () => import('@/components/Home/events'),
        Posts: () => import("@/components/posts"),
    },
    computed: {
        ...mapGetters(['user'])
    }
}
</script>

<style>

</style>