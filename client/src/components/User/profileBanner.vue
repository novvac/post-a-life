<template>
    <div class="banner" style="position: relative; overflow: hidden; height: 320px; border-top-left-radius: 16px; border-top-right-radius: 16px;">
        <v-file-input
            @change="changeBanner()" 
            v-if="owner" dark
            style="z-index: 1; position: absolute; bottom: 12px; right: 4px;"
            prepend-icon="mdi-camera"
            hide-input
            v-model="selectedFile"
            accept="image/png, image/jpeg, image/jpg"
            :rules="rules"
        ></v-file-input>
        <v-img :src="$http.defaults.baseURL + 'uploads/' + (banner ? banner : src)" height="100%"></v-img>
    </div>
</template>

<script>
import {
    mapActions,
} from 'vuex';

export default {
    name: "UserProfileBanner",
    props: {
        src: {
            type: String,
            required: true,
        },
        owner: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            selectedFile: null,
            banner: null,
            rules: [
                value => !value || value.size < 4000000 || "Wielkość obrazu nie może przekraczać 4MB"
            ]
        }
    },
    methods: {
        ...mapActions(['SET_USER_SNACKBAR']),
        ...mapActions(['LOGOUT']),
        changeBanner() {
            const formData = new FormData();
            formData.append("banner", this.selectedFile);
            if(this.selectedFile) {
                this.$http.post("user/banner/", formData)
                    .then(res => {
                        this.SET_USER_SNACKBAR({dialog: true, msg: "Baner został zmieniony! ", color: "success"});
                        this.$http.get("user/banner/").then(res => {
                            this.banner = res.data;
                        })
                    })
                    .catch(err => {
                        if(err.response) {
                            if(err.response.status === 401)
                                return this.LOGOUT();
                        }

                        this.SET_USER_SNACKBAR({dialog: true, msg: "Nie udało się zmienić banera!", color: "error"})
                    })
            }
        }
    },
    created() {
        console.log(this.banner);
    }
}
</script>

<style>
</style>