<template>
    <v-list-item
        class="py-2 d-block friend-block"
    >
        <div class="d-flex align-start" style="width: 100%;">
            <v-avatar size="32">
                <v-img :src="'http://192.168.43.5:3000/uploads/' + item.avatar"></v-img>
            </v-avatar>

            <div class="pl-4">
                <p class="ma-0 body-2">
                    <a :href="'/app/user/' + item.short_id">
                        <b>{{item.firstName}} {{item.lastName}}</b> ({{item.short_id}})
                    </a>
                </p>
                <p class="ma-0 caption">Chce dołączyć do grona twoich znajomych!</p>
            </div>
        </div>

        <div class="d-flex justify-center align-center my-3">
            <v-btn text class="caption" small @click="manageInvitation('SET')">
                <v-icon color="success" class="mr-1" small>mdi-check</v-icon>
                Potwierdź
            </v-btn>

            <v-btn text class="caption" small @click="manageInvitation('DESTROY')">
                <v-icon color="error mr-2" class="mr-1" small>mdi-delete</v-icon>
                Usuń
            </v-btn>
        </div>

        <v-divider></v-divider>
<!-- 
        <v-list-item-action v-if="!item.readed">
            <v-btn icon>
                <v-icon>mdi-check</v-icon>
            </v-btn>
        </v-list-item-action> -->
    </v-list-item>
</template>

<script>
export default {
    name: "friends",
    props: {
        item: {
            type: Object,
            required: true,
        }
    },
    methods: {
        manageInvitation(mutation) {
            this.$http.put("http://192.168.43.5:3000/api/user/relation/", {id: this.item.short_id, mutation: mutation})
                .then(res => {
                    console.log("ok");
                })
                .catch(err => {
                    console.log("err");
                })
        }
    }
}
</script>

<style lang="scss">
a {
    color: black !important;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
</style>