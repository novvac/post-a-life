<template>
    <div class="events ma-5" style="overflow: hidden;">
        <div class="hero">
            <div class="d-flex align-center justify-space-between">
                <div>
                    <p class="ma-0 caption">
                        Najpopularniejsze wśród znajomych
                    </p>
                    <span class="font-weight-bold display-1">
                        Wydarzenia
                    </span>
                </div>

                <v-btn icon large class="grey lighten-3">
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

        <v-row class="ma-0 mt-8">
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
            </v-col>
            <v-col cols="12" :md="4">
                <owner-events/>
                <invitations class="mt-5"/>
            </v-col>
        </v-row>
    </div>
</template>

<script>

export default {
    name: "Events",
    components: {
        EventHero: () => import('@/components/Events/hero'),
        EventInline: () => import('@/components/Events/inline'),
        OwnerEvents: () => import('@/components/Events/owner'),
        Invitations: () => import('@/components/Events/invitations'),
    },
}
</script>

<style lang="scss">
</style>