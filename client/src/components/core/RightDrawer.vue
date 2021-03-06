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
                    <v-badge dot overlap :color="subitem.isActive ? 'success' : 'transparent'">
                        <v-avatar size="36">
                            <v-img :src="$http.defaults.baseURL + 'uploads/' + subitem.avatar"></v-img>
                        </v-avatar>
                    </v-badge>

                    <div class="ml-2 d-flex flex-column">
                        <v-list-item-title class="body-2 font-weight-bold">
                            <router-link :to="'/app/user/' + subitem.short_id">{{subitem.firstName}} {{subitem.lastName}}</router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle class="caption grey--text">{{subitem.short_id}}</v-list-item-subtitle>
                    </div>

                    <div style="position: absolute; right: 12px;">
                        <v-badge dot overlap :color="subitem.hasUnread ? 'red' : 'transparent'">
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
                    subheader: "Znajomi",
                    content: []
                },
            ],
            heartbeat: null,
        }
    },
    computed: {
        ...mapGetters(['friends']),
        ...mapGetters(['newMessage']),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['LOAD_FRIENDS']),
        ...mapActions(['RESET_NEW_MESSAGE']),
        async loadFriends() {
            await this.LOAD_FRIENDS().then(() => {
                this.loadFriendsDetails().then(res => {
                    this.setHeartbeat();
                });
            })
        },
        async loadFriendsDetails() {
            let bufor = [];
            for(let id of this.friends) {
                await this.$http.get("user/id/" + id)
                    .then(res => {
                        let obj = res.data;
                        obj.isActive = false;
                        obj.hasUnread = false;
                        bufor.push(obj);

                        this.loadActiveUsers();
                        this.loadUnreadMessages();
                    })
                    .catch(err => {
                        if(err.response.status === 401) {
                            this.LOGOUT();
                        }
                    })
            }
            this.items[0].content = bufor;
        },
        setHeartbeat() {
            clearInterval(this.heartbeat);
            if(!this.heartbeat) {
                this.heartbeat = setInterval(this.loadActiveUsers, 5000);   // ! DEBUG <- change 2500 -> 15000 or 30000 later
            }
        },
        loadActiveUsers() {
            this.$http.post("user/active-friends", {
                ids: this.friends,
            })
                .then(res => {
                    let items = this.items[0].content;
                    let mapItems = items.map(item => item._id);
                    for(var i=0; i<items.length; i++) {
                        let found = res.data.find(el => el.id === items[i]._id);
                        let index = mapItems.indexOf(found.id);
                        if(index > -1)
                            this.items[0].content[index].isActive = found.isActive;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        async loadUnreadMessages() {
            await this.$http.get("user/unread-messages")
                .then(res => {
                    let mapItems = this.items[0].content.map(item => item._id);
                    let mapResponse = res.data.map(item => item.sender);

                    for(var i=0; i<mapItems.length; i++) {
                        let index = mapResponse.indexOf(mapItems[i]);
                        
                        if(index == -1) {
                            this.items[0].content[i].hasUnread = false;
                        } else {
                            this.items[0].content[i].hasUnread = true;
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    created() {
        this.loadFriends();
    },
    watch: {
        $route(to, from) {
            this.loadUnreadMessages();
        },
        friends() {
            this.loadFriendsDetails();
        },
        newMessage() {
            this.loadUnreadMessages();
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