<template>
    <base-card class="ma-0 event-inline py-3 py-md-0" dense to="#" @click="SET_EVENTS_DIALOG({component: 'event-details', id: data._id})">
        <v-row class="ma-0" align="center">
            <v-col class="d-none d-md-block pa-0" cols="12" :md="3">
                <v-img :src="$http.defaults.baseURL + 'uploads/' + data.image" style="border-radius:16px" height="100"/>
            </v-col>
            <v-col cols="12" :md="9" class="py-0">
                <div class="d-flex justify-space-between">
                    <div>
                        <v-chip class="caption chip" x-small>
                            <v-icon x-small class="mr-2">mdi-eye</v-icon>
                            <span>{{data.interested.length}}</span>
                            <div class="ml-1">zainteresowanych</div>
                        </v-chip>

                        <v-chip class="caption chip ml-2" x-small>
                            <v-icon x-small class="mr-2">mdi-check</v-icon>
                            <span>{{data.participants.length}}</span>
                            <div class="ml-1">weźmie udział</div>
                        </v-chip>      
                    </div>

                    <v-btn class="caption chip text-none ml-3 button" x-small color="white" @click.stop="SET_INVITE_FRIENDS({dialog: true, id: data._id})">
                        <v-icon x-small>mdi-bullhorn</v-icon>
                        <div class="ml-2">Zaproś znajomych</div>
                    </v-btn>           
                </div>

                <p class="mt-3 pa-0 ma-0 text-truncate body-1 font-weight-bold black--text">
                    {{data.title}}
                </p>
                <p class="mb-3 pa-0 ma-0 text-truncate caption">
                    {{data.description}}
                </p>
            </v-col>
        </v-row>
    </base-card>
</template>

<script>
import {
    mapGetters,
    mapActions,
} from 'vuex';

export default {
    name: "EventInline",
    props: {
        data: {
            type: Object,
            required: true,
        }
    },
    methods: {
        ...mapActions(['SET_INVITE_FRIENDS']),
        ...mapActions(['SET_EVENTS_DIALOG']),
    }
}
</script>

<style lang="scss">
.event-inline {
    cursor: default !important;

    .chip {
        transition: 300ms;

        div {
            display: none;
        }
        &:hover div {
            display: block;
        }
    }
}
</style>