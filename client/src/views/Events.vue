<template>
    <div class="events ma-5" style="overflow: hidden;">
        <div class="hero mb-8" v-if="popularEvents.length === 2">
            <div class="d-flex align-center justify-space-between">
                <div>
                    <p class="ma-0 caption">
                        Wydarzenia najbardziej
                    </p>
                    <span class="font-weight-bold display-1">
                        Popularne
                    </span>
                </div>

                <v-btn icon large class="grey lighten-3" @click="SET_EVENTS_DIALOG({component: 'new-event', id: null})">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>

            <v-row class="ma-0 mt-2">
                <v-col
                    cols="12" :md="6" 
                    class="pl-0"
                    v-for="event in popularEvents"
                    :key="event._id"
                >
                    <event-hero :event="event"/>
                </v-col>
            </v-row>
        </div>

        <v-row v-else class="ma-0" justify="center">
            <v-btn text large class="grey lighten-3" @click="SET_EVENTS_DIALOG({component: 'new-event', id: null})">
                Utwórz wydarzenie!<v-icon class="ml-2">mdi-plus</v-icon>
            </v-btn>
        </v-row>

        <v-row class="ma-0" style="flex-direction: row-reverse">
            <v-col cols="12" :md="4">
                <owner-events :events="userEvents"/>
                <invitations/>
                <interested/>
                <participant/>
            </v-col>

            <v-col cols="12" :md="8">
                <span class="font-weight-bold mb-3 d-block">
                    Nadchodzące wydarzenia
                </span>

                <infinite-scroll class="mt-5" endpoint="event" component="event-inline"/>
            </v-col>
        </v-row>
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
        Interested: () => import('@/components/Events/widgets/interested'),
        Participant: () => import('@/components/Events/widgets/participant'),
        
        InfiniteScroll: () => import('@/components/infiniteScroll'),
    },
    data() {
        return {
            popularEvents: [],
        }
    },
    computed: {
        ...mapGetters(['userEvents']),
    },
    methods: {
        ...mapActions(['SET_EVENTS_DIALOG']),
        ...mapActions(['LOAD_USER_EVENTS']),
        ...mapActions(['LOGOUT']),
        loadUserEvents() {
            this.LOAD_USER_EVENTS();
        },
        loadPopularEvents() {
            this.$http.get("event/most-popular/").then(res => {
                this.popularEvents = res.data;
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
        this.loadUserEvents();
        this.loadPopularEvents();
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