<template>
    <div class="new-event">
        <v-divider/>

        <div class="py-5">
            <v-list>
                <v-list-item-group
                    v-model="model"
                    multiple
                    color="indigo"
                >
                    <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                    >
                        <v-list-item-avatar>
                            <v-avatar size="32">
                                <v-img :src="$http.defaults.baseURL + 'uploads/' + item.avatar"></v-img>
                            </v-avatar>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{item.firstName}} {{item.lastName}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

            <v-divider class="my-5"></v-divider>

            <div class="d-flex justify-center" @click="invite()">
                <v-btn text>Zaproś</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    name: "Invitations",
    data() {
        return {
            loading: false,
            model: [],
            items: [],
        }
    },
    computed: {
        ...mapGetters(['friends']),
        ...mapGetters(['inviteFriends']),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['SET_EVENTS_DIALOG']),
        ...mapActions(['SET_INVITE_FRIENDS']),
        async loadFriends() {
            this.items = [];
            for(let friend of this.friends) {
                await this.$http.get('user/id/' + friend).then(res => {
                    let {banner, short_id, ...result} = res.data;
                    this.items.push(result);
                }).catch(err => {
                    if(err.response) {
                        if(err.response.status === 401)
                            this.LOGOUT();
                    }
                    
                    console.log(err);
                })
            }
        },
        invite() {
            let ids = [];
            for(let friend of this.model) {
                let id = this.items[friend]._id;
                ids.push(id);
            }
            
            this.$http.put(`event/${this.inviteFriends.id}/invitation/`, {ids}).then(res => {
                this.SET_INVITE_FRIENDS({dialog: false, id: null});
            }).catch(err => {
                if(err.response) {
                    if(err.response.status === 401)
                        this.LOGOUT();
                }

                console.log(err);
            })
        }
    },
    created() {
        this.loadFriends();
    },
    watch: {
        friends() {
            this.loadFriends();
        }
    }
}
</script>

<style>

</style>