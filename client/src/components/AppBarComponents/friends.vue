<template>
    <v-list-item
        class="pa-3 pt-2 d-block friend-block"
        v-if="invitation"
    >
        <div class="d-flex justify-space-between align-center">
            <v-row class="ma-0" align="center">
                <v-avatar size="36">
                    <v-img :src="'http://192.168.43.5:3000/uploads/' + this.invitation.avatar"></v-img>
                </v-avatar>

                <div class="ml-2">
                    <p class="ma-0 body-2">
                        <router-link :to="'/app/user/' + invitation.short_id">
                            <b>{{invitation.firstName}} {{invitation.lastName}}</b>
                        </router-link>
                        <span class="caption ml-1 grey--text">({{invitation.short_id}})</span>
                    </p>
                    <span>Macie 0 wspólnych znajomych!</span>
                </div>
            </v-row>
            
            <v-btn icon class="ml-5" @click="invitationManager('put')">
                <v-icon small color="green">mdi-check</v-icon>
            </v-btn>
            <v-btn icon class="ml-1" @click="invitationManager('delete')">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
        </div>
    </v-list-item>
</template>

<script>
import {
    mapActions
} from 'vuex';

export default {
    name: "friends",
    props: {
        item: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            invitation: null,
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['INVITATION_MANAGER']),
        invitationManager(action) {
            this.INVITATION_MANAGER({
                action: action,
                id: this.invitation.short_id,
            }).then(res => {
                this.invitation = null;
            })
        },
    },
    created() {
        this.$http.get("user/id/" + this.item)
            .then(res => {
                this.invitation = res.data;
            })
            .catch(err => {
                if(err.response.status === 401)
                    this.LOGOUT();
                console.log(err);
            })
    }
}
</script>

<style>
</style>