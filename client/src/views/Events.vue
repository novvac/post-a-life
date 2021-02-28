<template>
    <div class="events ma-5" style="overflow: hidden;">
        <div class="hero">
            <p class="ma-0 caption">
                Najpopularniejsze wśród znajomych
            </p>
            <span class="font-weight-bold display-1">
                Wydarzenia
            </span>

            <div
                class="hero-box mt-5"
            >
                <event-hero style="left: 0;"/>
                <event-hero style="left: 620px;"/>
            </div>
        </div>

        <v-row class="ma-0 mt-8">
            <v-col cols="12" :md="9">
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
            </v-col>
            <v-col cols="12" :md="3">
                zaproszenia, wydarzenia użytkownika itp.
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "Events",
    components: {
        EventHero: () => import('@/components/Events/hero'),
    },
}
</script>

<style lang="scss">
* {
    user-select: none;
}
.hero-box {
    position: relative;
    min-height: 320px;
}
</style>