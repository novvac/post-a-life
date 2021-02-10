<template>
    <base-card>
        <template v-slot:title>
            Post something
        </template>

        <v-list class="pa-0">
            <v-list-item class="pa-0 d-flex align-center justify-start">
                <v-avatar>
                    <v-img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"></v-img>
                </v-avatar>

                <v-textarea
                    solo
                    flat
                    hide-details
                    class="ml-2"
                    dense
                    rows="1"
                    no-resize
                    placeholder="What's on your mind?"
                />

                <v-btn icon large>
                    <v-icon>mdi-image-outline</v-icon>
                </v-btn>
            </v-list-item>
        </v-list>
    </base-card>
</template>

<script>
export default {
    name: "NewPost",
}
</script>

<style>

</style>