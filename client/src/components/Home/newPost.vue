<template>
    <base-card>
        <template v-slot:title>
            Post something
        </template>

        <v-list class="pa-0">
            <v-list-item class="pa-0 d-flex align-center justify-start">
                <v-avatar>
                    <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"></v-img>
                </v-avatar>

                <v-textarea
                    solo
                    flat
                    hide-details
                    class="ml-2"
                    dense
                    rows="1"
                    no-resize
                    placeholder="What's on your mind?"
                />

                <v-btn icon large>
                    <v-icon>mdi-image-outline</v-icon>
                </v-btn>
            </v-list-item>
        </v-list>
    </base-card>
</template>

<script>
import {
    mapGetters
} from 'vuex';

export default {
    name: "NewPost",
    computed: {
        ...mapGetters(['user']),
    }
}
</script>

<style>

</style>