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
                        {{feed.createdAt}}
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
            <v-btn tile text class="caption text-capitalize py-6">
                <v-icon small class="mr-2">mdi-heart-outline</v-icon>
                <b class="mr-1">{{feed.likes.length}}</b> Polubień
            </v-btn>
            <v-btn tile text class="caption text-capitalize py-6">
                <v-icon small class="mr-2">mdi-comment-outline</v-icon>
                <b class="mr-1">{{feed.comments.length}}</b> Komentarze
            </v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <div class="pa-4 d-flex align-center">
            <v-avatar size="36">
                <v-img :src="'http://192.168.43.5:3000/uploads/' + user.avatar"></v-img>
            </v-avatar>

            <v-text-field
                outlined
                rounded
                placeholder="Napisz komentarz..."
                dense
                hide-details
                class="ml-2 caption"
                append-icon="mdi-face"
            />
        </div>
    </base-card>
</template>

<script>
import {
    mapGetters
} from 'vuex';

export default {
    name: "Post",
    props: {
        feed: {
            type: Object,
            required: true,
        }
    },
    computed: {
        ...mapGetters(['user']),
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