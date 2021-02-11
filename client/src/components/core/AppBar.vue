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

        <div class="d-flex">
            <base-menu
                v-for="action in actions"
                :key="action.icon"
            >
                <template v-slot:activator>
                    <v-btn icon>
                        <v-icon>mdi-{{action.icon}}</v-icon>
                    </v-btn>
                </template>

                <base-card :rounded="0">
                    Content here
                </base-card>
            </base-menu>
        </div>
    </v-app-bar>
</template>

<script>
export default {
    name: "CoreAppBar",
    data() {
        return {
            actions: [
                {
                    icon: "account-plus-outline",
                    content: [],
                },
                {
                    icon: "bell-outline",
                    content: [],
                },
                {
                    icon: "message-text-outline",
                    content: [],
                }
            ]
        }
    }
}
</script>

<style>

</style>