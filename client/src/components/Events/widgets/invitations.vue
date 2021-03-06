<template>
    <base-card class="mt-5" v-if="events.length > 0">
        <template v-slot:title>
            Zaproszenia do wydarzeń
        </template>

        <template v-slot:action>
            <v-btn small icon>
                <v-icon small>mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>

        <v-list class="pa-0">
            <v-list-item
                v-for="invitation in events"
                :key="invitation.text"
                class="mt-1 px-2"
                link
                dense
                @click="SET_EVENTS_DIALOG({component: 'event-details', id: invitation._id})"
            >
                <v-list-item-title class="body-2 font-weight-bold ml-3">
                    <v-row class="ma-0" align="center">
                        {{invitation.title}}

                        <v-spacer></v-spacer>

                        <v-btn small icon @click.stop="DELETE_EVENT_INVITE(invitation._id)">
                            <v-icon small>mdi-close</v-icon>
                        </v-btn>
                    </v-row>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </base-card>
</template>

<script>
import {
    mapGetters,
    mapActions,
} from 'vuex';

export default {
    name: "Invitations",
    data() {
        return {
            events: [],
        }
    },
    computed: {
        ...mapGetters(['invitationsEvents']),
    },
    methods: {
        ...mapActions(['SET_EVENTS_DIALOG']),
        ...mapActions(['LOAD_INVITATIONS_EVENTS']),
        ...mapActions(['DELETE_EVENT_INVITE']),
    },
    created() {
        this.LOAD_INVITATIONS_EVENTS();
    },
    watch: {
        invitationsEvents() {
            this.events = this.invitationsEvents;
        }
    }
}
</script>

<style>

</style>