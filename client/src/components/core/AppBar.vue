<template>
    <v-app-bar
        app
        flat
        clipped-left
        clipped-right
        color="white"
        style="border-bottom: 1px solid #cecece !important;"
    >
        <h2>Logo</h2>

        <v-spacer></v-spacer>

        <v-text-field
            placeholder="Type something to search"
            solo
            outlined
            append-icon="mdi-magnify"
            clearable
            hide-details
            flat
            dense
        />

        <v-spacer></v-spacer>

        <div>
            <v-btn icon>
                <v-icon>mdi-account-plus-outline</v-icon>
            </v-btn>

            <v-btn icon class="mx-2">
                <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
            
            <v-btn icon>
                <v-icon>mdi-message-text-outline</v-icon>
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
export default {
    name: "CoreAppBar",
    data() {
        return {

        }
    }
}
</script>

<style>

</style>