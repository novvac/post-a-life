<template>
    <div class="user ma-5">
        <base-card without-padding>
            <profile-banner src="https://papers.co/wallpaper/papers.co-oc25-summer-tree-leaf-vacation-green-nature-29-wallpaper.jpg"/>
            <avatar src="https://i.pinimg.com/originals/bb/0c/07/bb0c074019ee55b098fb023ec53be7fb.png"/>
        
            <div>
                <p class="ma-0 text-center mt-4 title black--text">John Doe</p>
                <p class="ma-0 text-center caption">#fd5s</p>
            </div>

            <v-divider class="mt-5"></v-divider>
            <v-row class="ma-0 mx-5 my-3" align="center">
                <v-btn text class="caption text-capitalize elevation-0">
                    <v-icon class="mr-3" small>mdi-account-plus</v-icon>
                    Dodaj do znajomych
                </v-btn>

                <v-btn text class="caption text-capitalize elevation-0 ml-2">
                    <v-icon class="mr-3" small>mdi-message</v-icon>
                    Wyślij wiadomość
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn class="caption text-capitalize elevation-0 ml-2">
                    <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-row>
            <v-divider></v-divider>

            <div class="pa-5">User content here</div>
        </base-card>
    </div>
</template>

<script>
export default {
    name: "User",
    components: {
        profileBanner: () => import('@/components/User/profileBanner'),
        avatar: () => import("@/components/User/avatar"),
    },
    created() {
        console.log("loading user....");
    }
}
</script>

<style>

</style>