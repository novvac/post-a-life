<template>
    <v-navigation-drawer
        app
        clipped
        right
    >
        <v-list
            v-for="item in items"
            :key="item.subheader"
            class="pa-0"
        >
            <v-subheader>{{item.subheader}}</v-subheader>
            <div v-if="item.content.length > 0">
                <v-list-item
                    v-for="subitem in item.content"
                    :key="subitem.to"
                    :to="subitem.to"
                >
                    {{subitem}}

                    <v-avatar size="36">
                        <v-img :src="'http://192.168.43.5:3000/uploads/' + subitem.avatar"></v-img>
                    </v-avatar>

                    <div class="ml-2 d-flex flex-column">
                        <v-list-item-title class="body-2 font-weight-bold">{{subitem.firstName}} {{subitem.lastName}}</v-list-item-title>
                        <v-list-item-subtitle class="caption grey--text">{{subitem.short_id}}</v-list-item-subtitle>
                    </div>
                </v-list-item>
            </div>
            <p class="ma-0 mx-5 caption" v-else>
                Nic tu nie ma! :<
            </p>

            <v-divider class="mt-5"></v-divider>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import {
    mapActions,
    mapGetters,
} from 'vuex';

export default {
    name: "CoreRightDrawer",
    data() {
        return {
            items: [
                {
                    subheader: "Twoje strony",
                    content: []
                },
                {
                    subheader: "Znajomi",
                    content: []
                },
                {
                    subheader: "Grupy",
                    content: []
                }
            ],
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    methods: {
        ...mapActions(['LOAD_FRIENDS']),
        loadFriends() {
            this.LOAD_FRIENDS().then(() => {
                this.items[1].content = this.user.friends;
            })
        }
    },
    created() {
        this.loadFriends();
    },
    watch: {
        $route(to, from) {
            this.loadFriends();
        } 
    }
}
</script>

<style>

</style>