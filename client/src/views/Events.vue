<template>
    <div class="events ma-5" style="overflow: hidden;">
        <div class="hero mb-8" v-if="false"> <!-- ! DEBUG -->
            <div class="d-flex align-center justify-space-between">
                <div>
                    <p class="ma-0 caption">
                        Najpopularniejsze wśród znajomych
                    </p>
                    <span class="font-weight-bold display-1">
                        Wydarzenia
                    </span>
                </div>

                <v-btn icon large class="grey lighten-3" @click="SET_EVENTS_DIALOG({component: 'new-event', id: null})">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>

            <v-row class="ma-0 mt-2">
                <v-col cols="12" :md="6" class="px-0 pr-md-2">
                    <event-hero src="najman.png" :event="{title: 'Nazwa nowego wydarzenia'}"/>
                </v-col>
                <v-col cols="12" :md="6" class="px-0 pl-md-2">
                    <event-hero src="event-bg-2.png" :event="{title: 'Nazawa innego wydarzenia'}"/>
                </v-col>
            </v-row>
        </div>

        <v-row class="ma-0" style="flex-direction: row-reverse">
            <v-col cols="12" :md="4">
                <owner-events :events="userEvents"/>
                <invitations class="mt-5"/>
            </v-col>

            <v-col cols="12" :md="8">
                <span class="font-weight-bold mb-3 d-block">
                    Nadchodzące wydarzenia
                </span>

                <v-row class="ma-0" align="center" justify="space-between">
                    <v-btn color="primary" class="caption py-5 text-none" style="border-radius: 8px">
                        Wszystko
                    </v-btn>

                    <v-select
                        :items="['Opcja']"
                        solo
                        class="caption elevation-0"
                        placeholder="Najnowsze"
                        hide-details
                        style="flex: none; border-radius: 8px; box-shadow: 0 !important;"
                    ></v-select>
                </v-row>

                <div class="events-list mt-5">
                    <event-inline src="najman.png" :event="{title: 'Nazwa nowego wydarzenia'}"/>
                    <event-inline class="mt-3" src="event-bg-1.png" :event="{title: 'Zdam maturę na 30 percent'}"/>
                    <event-inline class="mt-3" src="event-bg-2.png" :event="{title: 'POLSKA DLA POLAKÓW - nie no żartuje xd'}"/>
                </div>

                <infinite-scroll endpoint="event" component="event-inline"/>
            </v-col>
        </v-row>

        <!-- DIALOG WINDOW -->
        <v-dialog v-model="eventsDialog" persistent max-width="1000px">
            <base-card without-padding>
                <div>
                    <v-row class="ma-0 pa-5" align="center">
                        <v-spacer></v-spacer>

                        <v-btn icon @click="SET_EVENTS_DIALOG(null)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-row>

                    <component v-if="eventsDialog" :is="eventsDialog.component"/>
                </div>
            </base-card>
        </v-dialog>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    name: "Events",
    components: {
        EventHero: () => import('@/components/Events/hero'),
        EventInline: () => import('@/components/Events/inline'),

        OwnerEvents: () => import('@/components/Events/widgets/owner'),
        Invitations: () => import('@/components/Events/widgets/invitations'),

        NewEvent: () => import('@/components/Events/dialog/newEvent'),
        EventDetails: () => import('@/components/Events/dialog/eventDetails'),
        
        InfiniteScroll: () => import('@/components/infiniteScroll'),
    },
    computed: {
        ...mapGetters(['eventsDialog']),
        ...mapGetters(['userEvents']),
    },
    methods: {
        ...mapActions(['SET_EVENTS_DIALOG']),
        ...mapActions(['LOAD_USER_EVENTS']),
        loadUserEvents() {
            this.LOAD_USER_EVENTS();
        }
    },
    created() {
        this.loadUserEvents();
    },
    watch: {
        $route(from, to) {
            this.loadUserEvents();
        }
    }
}
</script>

<style lang="scss">
</style>