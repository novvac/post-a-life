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
            heartbeat: null,
        }
    },
    computed: {
        ...mapGetters(['friends'])
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['LOAD_FRIENDS']),
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
                await this.$http.get("http://192.168.43.5:3000/api/user/id/" + id)
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
            this.items[1].content = bufor;
        },
        setHeartbeat() {
            clearInterval(this.heartbeat);
            if(!this.heartbeat) {
                this.heartbeat = setInterval(this.loadActiveUsers, 5000);   // ! DEBUG <- change 2500 -> 15000 or 30000 later
            }
        },
        loadActiveUsers() {
            this.$http.post("http://192.168.43.5:3000/api/user/active-friends", {
                ids: this.friends,
            })
                .then(res => {
                    let items = this.items[1].content;
                    let mapItems = items.map(item => item._id);
                    for(var i=0; i<items.length; i++) {
                        let found = res.data.find(el => el.id === items[i]._id);
                        let index = mapItems.indexOf(found.id);
                        if(index > -1)
                            this.items[1].content[index].isActive = found.isActive;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        loadUnreadMessages() {
            this.$http.get("http://192.168.43.5:3000/api/user/unread-messages")
                .then(res => {
                    let mapItems = this.items[1].content.map(item => item._id);
                    for(var i=0; i<res.data.length; i++) {
                        let index = mapItems.indexOf(res.data[i].sender);
                        this.items[1].content[index].hasUnread = true;
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
        friends() {
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