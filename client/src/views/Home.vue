<template>
    <div class="home pa-5">
        <v-row class="ma-0">
            <v-col cols="12" :md="8">
                <new-post/>
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
    }
}
</script>

<style>

</style>