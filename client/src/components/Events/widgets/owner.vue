<template>
    <base-card v-if="events.length > 0">
        <template v-slot:title>
            Twoje wydarzenia
        </template>

        <template v-slot:action>
            <v-btn small icon>
                <v-icon small>mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>

        <v-list class="pa-0">
            <v-list-item
                v-for="event in events"
                :key="event.text"
                class="mt-1 px-0"
                link
                dense
                @click="SET_EVENTS_DIALOG({component: 'event-details', id: event._id})"
            >
                <v-list-item-title caption class="ml-3">{{event.title}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </base-card>
</template>

<script>
import {
    mapActions,
} from 'vuex';

export default {
    name: "OwnerEvents",
    props: {
        events: {
            type: Array,
            required: true,
        }
    },
    methods: {
        ...mapActions(['SET_EVENTS_DIALOG']),
    }
}
</script>

<style>

</style>