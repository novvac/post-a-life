<template>
    <v-navigation-drawer
        app
        clipped
        right
    >
        <v-list
            v-for="item in items"
            :key="item.subheader"
            class="pa-0"
        >
            <v-subheader>{{item.subheader}}</v-subheader>
            <v-list-item
                v-for="subitem in item.content"
                :key="subitem.to"
                :to="subitem.to"
            >
                <v-avatar size="36">
                    <v-img :src="subitem.avatar"></v-img>
                </v-avatar>

                {{subitem.text}}
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: "CoreRightDrawer",
    data() {
        return {
            items: [
                {
                    subheader: "Your pages",
                    content: [
                        {avatar: "https://i.pinimg.com/736x/d6/a9/57/d6a957f1d8045c9c973c12bf5968326f.jpg", text: "Cyntia Kaleskov", to: "/app/pages/cyntia-kaleskov"},
                    ]
                },
                {
                    subheader: "Friends",
                    content: [
                        {avatar: "https://i.pinimg.com/736x/d6/a9/57/d6a957f1d8045c9c973c12bf5968326f.jpg", text: "Cyntia Kaleskov", to: "/app/pages/cyntia-kaleskov"},
                    ]
                },
                {
                    subheader: "Groups",
                    content: [
                        {avatar: "https://i.pinimg.com/736x/d6/a9/57/d6a957f1d8045c9c973c12bf5968326f.jpg", text: "Cyntia Kaleskov", to: "/app/pages/cyntia-kaleskov"},
                    ]
                }
            ],
        }
    }
}
</script>

<style>

</style>