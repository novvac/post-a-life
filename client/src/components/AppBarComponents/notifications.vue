<template>
    <v-list-item
        link
        :to="'/app/user/' + item.short_id"
    >
        <v-row class="ma-0">
            <v-avatar size="32">
                <v-img :src="$http.defaults.baseURL + 'uploads/' + item.avatar"></v-img>
            </v-avatar>

            <div class="ml-2">
                <v-list-item-title class="caption"><b>{{item.firstName}} {{item.lastName}}</b></v-list-item-title>
                <v-list-item-subtitle>{{item.short_id}}</v-list-item-subtitle>
            </div>
        </v-row>

        <!-- <v-list-item-action>
            <v-btn icon>
                <v-icon>mdi-check</v-icon>
            </v-btn>
        </v-list-item-action> -->
    </v-list-item>
</template>

<script>
export default {
    name: "notifications",
    props: {
        item: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style>

</style>