<template>
    <div class="avatar">
        <v-avatar size="160" style="position: relative" :class="owner ? 'owner' : undefined">
            <v-img :src="$http.defaults.baseURL + 'uploads/' + (avatar ? avatar : src)"></v-img>

            <v-file-input
                @change="changeAvatar()" 
                v-if="owner" dark
                style="z-index: 9; position: absolute;"
                prepend-icon="mdi-camera"
                hide-input
                v-model="selectedFile"
                accept="image/png, image/jpeg, image/jpg"
                :rules="rules"
                class="icon"
            ></v-file-input>
        </v-avatar>
    </div>
</template>

<script>
import {
    mapActions
} from 'vuex';

export default {
    name: "UserAvatar",
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
            avatar: null,
            rules: [
                value => !value || value.size < 2000000 || "Wielkość obrazu nie może przekraczać 2MB"
            ]
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['SET_USER_SNACKBAR']),
        changeAvatar() {
            const formData = new FormData();
            formData.append("avatar", this.selectedFile);
            this.$http.post("user/avatar/", formData)
                .then(res => {
                    this.SET_USER_SNACKBAR({dialog: true, msg: "Avatar został zmieniony! ", color: "success"});
                    this.$http.get("user/avatar/").then(res => {
                        this.avatar = res.data;
                    })
                })
                .catch(err => {
                    if(err.response) {
                        if(err.response.status === 401)
                            this.LOGOUT();
                    }

                    this.SET_USER_SNACKBAR({dialog: true, msg: "Nie udało się zmienić avatara!", color: "error"})
                })
        }
    }
}
</script>

<style lang="scss">
.avatar {
    width: 100%;
    height: 60px;
    position: relative;

    .v-avatar {
        transform: translate(-50%, -60%);
        left: 50%;
        position: absolute;
        border: 6px solid white;

        &.owner:after {
            opacity: 0;
            z-index:1;
            content: "";
            position: absolute;
            top:0;left:0;right:0;bottom:0;
            background: black;
            transition: 250ms;
        }
        &.owner:hover:after {
            opacity: .6;
        }
        .icon {
            display: none;
        }
        &.owner:hover .icon {
            display: block;
        }
    }

    // TODO: center icon
    .v-input__prepend-outer {
        margin: 0 !important;

        button:before {
            font-size: 2.5rem;
        }
    }
}
</style>