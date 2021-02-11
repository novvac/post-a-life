<template>
    <base-card>
        <template v-slot:title>
            Events
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
                class="mt-1 px-2 py-1"
                link
                dense
            >
                <v-icon>mdi-{{event.icon}}</v-icon>

                <v-list-item-title class="body-2 font-weight-bold ml-3">{{event.text}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </base-card>
</template>

<script>
export default {
    name: "Events",
    data() {
        return {
            events: [
                {icon: "gift", text: "Collect your dream!"},
                {icon: "crown", text: "F**k covid!"},
            ]
        }
    }
}
</script>

<style>

</style>