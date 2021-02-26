<template>
    <v-navigation-drawer
        app
        clipped
        right
        class="right-drawer"
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
                    class="d-flex align-center"
                >
                    <v-badge dot overlap color="success">
                        <v-avatar size="36">
                            <v-img :src="'http://192.168.43.5:3000/uploads/' + subitem.avatar"></v-img>
                        </v-avatar>
                    </v-badge>

                    <div class="ml-2 d-flex flex-column">
                        <v-list-item-title class="body-2 font-weight-bold">
                            <router-link :to="'/app/user/' + subitem.short_id">{{subitem.firstName}} {{subitem.lastName}}</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="caption grey--text">{{subitem.short_id}}</v-list-item-subtitle>
                    </div>

                    <div style="position: absolute; right: 12px;">
                        <v-badge dot overlap color="red">
                            <router-link :to="'/app/chat/' + subitem.short_id">
                                <v-btn icon>
                                    <v-icon small>mdi-message-text-outline</v-icon>
                                </v-btn>
                            </router-link>
                        </v-badge>
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
        ...mapGetters(['friends'])
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['LOAD_FRIENDS']),
        loadFriends() {
            this.LOAD_FRIENDS().then(() => {
                this.loadFriendsDetails();
            })
        },
        loadFriendsDetails() {
            let bufor = [];
            for(let id of this.friends) {
                this.$http.get("http://192.168.43.5:3000/api/user/id/" + id)
                    .then(res => {
                        bufor.push(res.data);
                    })
                    .catch(err => {
                        if(err.response.status === 401) {
                            this.LOGOUT();
                        }
                    })
            }
            this.items[1].content = bufor;
        }
    },
    created() {
        this.loadFriends();
    },
    watch: {
        friends() {
            console.log("OK");
            this.loadFriendsDetails();
        }
    }
}
</script>

<style lang="scss">
.right-drawer {
    a {
        text-decoration: none;
        color: #333;
    }
}
</style>