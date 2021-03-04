<template>
    <base-card>
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
                v-for="invitation in invitations"
                :key="invitation.text"
                class="mt-1 px-2"
                link
                dense
            >
                <v-list-item-title class="body-2 font-weight-bold ml-3">{{invitation.text}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </base-card>
</template>

<script>
export default {
    name: "OwnerEvents",
    data() {
        return {
            invitations: [
                {icon: "gift", text: "Collect your dream!"},
                {icon: "crown", text: "F**k covid!"},
            ]
        }
    }
}
</script>

<style>

</style>