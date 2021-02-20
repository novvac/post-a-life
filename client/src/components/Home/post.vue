<template>
    <base-card class="post">
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

        <p class="body-2 ma-0 black--text">
            {{feed.mind}}
        </p>
    </base-card>
</template>

<script>
export default {
    name: "Post",
    props: {
        feed: {
            type: Object,
            required: true,
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