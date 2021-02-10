<template>
    <base-card>
        <template v-slot:title>
            Friend stories
        </template>

        <template v-slot:action>
            <v-btn small icon>
                <v-icon small>mdi-dots-horizontal</v-icon>
            </v-btn>
        </template>

        <v-list class="pa-0">
            <v-list-item class="pa-0">
                <v-btn icon class="elevation-2" large>
                    <v-icon color="primary">mdi-plus</v-icon>
                </v-btn>

                <div class="ml-3">
                    <v-list-item-title class="body-1">Create Your Story</v-list-item-title>
                    <v-list-item-subtitle class="caption">Click the button beside to create!</v-list-item-subtitle>
                </div>
            </v-list-item>

            <v-list-item
                v-for="story in stories"
                :key="story.text"
                class="mt-1 px-2 py-1"
                link
            >
                <v-avatar size="36">
                    <v-img :src="story.avatar"></v-img>
                </v-avatar>

                <div class="ml-3">
                    <v-list-item-title class="body-2 font-weight-bold">{{story.text}}</v-list-item-title>
                    <v-list-item-subtitle class="caption">{{story.subtext}}</v-list-item-subtitle>
                </div>
            </v-list-item>
        </v-list>

        <template v-slot:other-action>
            <v-btn tile width="100%" class="py-6" text color="primary" style="border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
                See all
            </v-btn>
        </template>
    </base-card>
</template>

<script>
export default {
    name: "Stories",
    data() {
        return {
            stories: [
                {avatar: "https://www.clinicdermatech.com/images/men-service-face.jpg", text: "Andrew Hoffman", subtext: "10 luty, 15:46"},
                {avatar: "https://c4.wallpaperflare.com/wallpaper/45/913/269/women-face-green-eyes-portrait-wallpaper-preview.jpg", text: "Natasha Korenowa", subtext: "09 luty, 20:06"},
                {avatar: "https://i.pinimg.com/736x/d6/a9/57/d6a957f1d8045c9c973c12bf5968326f.jpg", text: "Jane Kolorado", subtext: "09 luty, 17:42"},
            ]
        }
    }
}
</script>

<style>

</style>