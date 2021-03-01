<template>
    <base-card class="ma-0 event-inline" dense to="#" @click="SET_EVENTS_DIALOG({component: 'event-details', id: 0})">
        <v-row class="ma-0" align="center">
            <v-col class="d-none d-md-block pa-0" cols="12" :md="3">
                <v-img :src="require('../../assets/'+src)" style="border-radius:16px" height="120"/>
            </v-col>
            <v-col cols="12" :md="9" class="py-0">
                <div class="d-flex justify-space-between">
                    <div>
                        <v-chip class="caption chip" x-small>
                            <v-icon x-small class="mr-2">mdi-eye</v-icon>
                            <span>42</span>
                            <div class="ml-1">zainteresowanych</div>
                        </v-chip>

                        <v-chip class="caption chip ml-2" x-small>
                            <v-icon x-small class="mr-2">mdi-check</v-icon>
                            <span>92</span>
                            <div class="ml-1">weźmie udział</div>
                        </v-chip>      
                    </div>

                    <v-btn class="caption chip text-none ml-3 button" x-small color="white">
                        <v-icon x-small>mdi-bullhorn</v-icon>
                        <div class="ml-2">Zaproś znajomych</div>
                    </v-btn>           
                </div>

                <p class="mt-3 pa-0 ma-0 text-truncate body-2 font-weight-bold black--text">
                    {{event.title}}
                </p>
                <p class="mb-3 pa-0 ma-0 text-truncate caption">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae ea nihil accusantium qui distinctio voluptates nulla ratione neque adipisci placeat, aut fugit? Corrupti architecto dignissimos quisquam quam maxime ex vero?
                </p>

                <div class="d-flex"> 
                    <v-btn text class="caption text-none button" x-small>
                        <v-icon x-small class="mr-2">mdi-eye</v-icon>
                        Zainteresowany
                    </v-btn>
                    <v-btn text class="caption text-none ml-3 button" x-small>
                        <v-icon x-small class="mr-2">mdi-check</v-icon>
                        Wezmę udział
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </base-card>
</template>

<script>
import {
    mapActions,
} from 'vuex';

export default {
    name: "EventInline",
    props: {
        src: {
            type: String,
            required: true,
        },
        event: {
            type: Object,
            required: true,
        }
    },
    methods: {
        ...mapActions(['SET_EVENTS_DIALOG']),
    }
}
</script>

<style lang="scss">
.event-inline {
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