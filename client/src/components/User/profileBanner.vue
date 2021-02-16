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
        <v-img :src="src" height="100%"></v-img>
    </div>
</template>

<script>
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
            rules: [
                value => !value || value.size < 4000000 || "Wielkość obrazu nie może przekraczać 4MB"
            ]
        }
    },
    methods: {
        changeBanner() {
            const formData = new FormData();
            formData.append("banner", this.selectedFile);
            this.$http.post("http://192.168.43.5:3000/api/user/banner/upload/", formData)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}
</script>

<style>
</style>