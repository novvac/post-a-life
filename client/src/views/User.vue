<template>
    <div class="user ma-5">
        <base-card v-if="!loaded" style="height: 100%">
            <v-progress-circular
                indeterminate
                class="mr-3"
                color="primary"
            />

            Ładowanie danych...
        </base-card>

        <base-card without-padding v-else-if="loaded && !msg">
            <profile-banner src="https://papers.co/wallpaper/papers.co-oc25-summer-tree-leaf-vacation-green-nature-29-wallpaper.jpg"/>
            <avatar src="https://i.pinimg.com/originals/bb/0c/07/bb0c074019ee55b098fb023ec53be7fb.png"/>
        
            <div>
                <p class="ma-0 text-center mt-4 title black--text">{{basicData.firstName}} {{basicData.lastName}}</p>
                <p class="ma-0 text-center caption">#{{basicData.short_id}}</p>
            </div>

            <v-divider class="mt-5"></v-divider>
            <v-row class="ma-0 mx-5 my-3" align="center">
                <div v-if="id != user.short_id">
                    <v-btn text class="caption text-capitalize elevation-0">
                    <v-icon class="mr-3" small>mdi-account-plus</v-icon>
                        Dodaj do znajomych
                    </v-btn>

                    <v-btn text class="caption text-capitalize elevation-0 ml-2">
                        <v-icon class="mr-3" small>mdi-message</v-icon>
                        Wyślij wiadomość
                    </v-btn>
                </div>

                <v-spacer></v-spacer>

                <v-btn class="caption text-capitalize elevation-0" v-if="id === user.short_id">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>

                <v-btn class="caption text-capitalize elevation-0 ml-2">
                    <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-row>
            <v-divider></v-divider>

            <v-row class="ma-0 pa-5">
                here we go
            </v-row>
        </base-card>

        <base-card v-else>
            {{msg}}
        </base-card>   
    </div>
</template>

<script>
import {
    mapGetters,
} from 'vuex';

export default {
    name: "User",
    data() {
        return {
            loaded: true,
            basicData: null,
            msg: null,
        }
    },
    computed: {
        ...mapGetters(['user']),
        id() {
            return this.$route.params.id;
        }
    },
    components: {
        profileBanner: () => import('@/components/User/profileBanner'),
        avatar: () => import("@/components/User/avatar"),
    },
    methods: {
        loadBasicData() {
            return this.$http.get("http://192.168.43.5:3000/api/user/basic-data/" + this.id);
        },
        LOAD_USER() {
            this.msg = null;
            this.basicData = {},
            this.loaded = false;
            this.$http.all([this.loadBasicData()])
                .then(this.$http.spread((basicData) => {
                    this.basicData = basicData.data;
                    this.loaded = true;
                }))
                .catch(err => {
                    if(err.response.status === 401) {
                        if(this.$cookies.get("token"))
                            this.$cookies.remove("token");
                        this.$router.push("/auth/login");
                    }
                        
                    this.msg = err.response.data;
                    this.loaded = true;
                })
        }
    },
    created() {
        this.LOAD_USER();
    },
}
</script>

<style>

</style>