<template>
    <div class="event-details">
        <v-skeleton-loader
            class="mx-auto"
            type="card"
            v-if="!event"
        />

        <div v-else>
            <v-img :src="$http.defaults.baseURL + 'uploads/' + event.image" height="300px"></v-img>

            <div class="pa-5">
                <div class="d-flex">
                    <span class="text-h5 font-weight-bold black--text ml-3">{{event.title}}</span>
                </div>

                <div class='mt-4 mt-md-2 d-md-flex align-center justify-space-between'>
                    <div class="text-center text-md-left">
                        <v-chip class="caption chip" small>
                            <v-icon x-small class="mr-2">mdi-eye</v-icon>
                            <span>{{event.interested.length}}</span>
                            <div class="ml-1 d-none d-md-block">zainteresowanych</div>
                        </v-chip>

                        <v-chip class="caption chip ml-2" small>
                            <v-icon x-small class="mr-2">mdi-check</v-icon>
                            <span>{{event.participants.length}}</span>
                            <div class="ml-1 d-none d-md-block">weźmie udział</div>
                        </v-chip>
                    </div>

                    <div class="mt-5 mt-md-0">
                        <v-btn class="caption text-none button" text>
                            <v-icon small class="mr-2">mdi-eye</v-icon>
                            Zainteresowany
                        </v-btn>
                        <v-btn class="caption text-none ml-3 button" text>
                            <v-icon small class="mr-2">mdi-check</v-icon>
                            Wezmę udział
                        </v-btn>
                    </div> 
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="text-justify">
                    <b>Opis</b><br>
                    {{event.description}}
                </div>

                <div class="d-flex justify-end mt-5 mt-md-0">
                    <v-btn class="caption text-none button grey lighten-4" text>
                        <v-icon small class="mr-2">mdi-bullhorn</v-icon>
                        Zaproś znajomych
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
} from 'vuex';

export default {
    name: "EventDetails",
    data() {
        return {
            event: null,
        }
    },
    computed: {
        ...mapGetters(['eventsDialog']),
    },
    methods: {
        ...mapActions(['LOGOUT']),
        async loadEvent() {
            await this.$http.get("event/" + this.eventsDialog.id).then(res => {
                this.event = res.data.event;
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
        this.loadEvent();
    }
}
</script>

<style>

</style>