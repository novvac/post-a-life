<template>
    <div :class="['comment', 'py-2', 'px-4', reply ? 'reply' : undefined]">
        <v-list-item
            v-bind="$attrs"
            v-on="$listeners"
            class="d-flex align-start pa-0"
        >
            <v-avatar size="32">
                <v-img :src="'http://192.168.43.5:3000/uploads/' + comment.owner.avatar"></v-img>
            </v-avatar>

            <div class="ml-4">
                <p class="ma-0 body-2">
                    <router-link :to="'/app/user/' + comment.owner.short_id">
                        <b>{{comment.owner.firstName}} {{comment.owner.lastName}}</b>
                    </router-link>
                    <span class="caption ml-3 grey--text">
                        <v-icon small color="grey--text">mdi-clock-outline</v-icon>
                        {{createdAt.value}} {{createdAt.suffix}} temu
                    </span>
                </p>
                <p class="ma-0 caption"><b v-if="reply" class="primary--text"></b> {{comment.text}}</p>
            </div>
        </v-list-item>

        <div class="caption d-flex align-center mt-1">
            <v-btn small icon>
                <v-icon x-small>mdi-thumb-up</v-icon>
            </v-btn>

            <span class="mx-1 font-weight-bold success--text">
                {{comment.likes.length - comment.dislikes.length}}
            </span>

            <v-btn small icon>
                <v-icon x-small>mdi-thumb-down</v-icon>
            </v-btn>

            <base-menu :close-on-content-click="false" min-width="30%" v-if="!reply">
                <template v-slot:activator>
                    <v-btn x-small text class="caption text-capitalize ml-2">
                        <v-icon x-small>mdi-reply</v-icon>

                        <span class="ml-1">Odpowiedz</span>
                    </v-btn>
                </template>

                <base-card dense>
                    <v-text-field
                        outlined
                        placeholder="Napisz komentarz..."
                        dense
                        autofocus
                        class="caption"
                        v-model="subcomment.model"
                        :loading="subcomment.loading"
                        :disabled="subcomment.disabled"
                        :hide-details="!Boolean(errors.comment)"
                        :error="Boolean(errors.comment)"
                        :error-messages="errors.comment"
                        @keyup.enter="addSubcomment()"
                    />
                </base-card>
            </base-menu>
        </div>
    </div>
</template>

<script>
import {
    mapActions,
} from 'vuex';

export default {
    name: "Comment",
    data() {
        return {
            errors: {},
            subcomment: {
                model: "",
                loading: false,
            },
            subcomments: {
                loading: false,
                limit: 4,
                skip: 0,
                list: []
            }
        }
    },
    props: {
        reply: {
            type: Boolean,
            default: false,
        },
        comment: {
            type: Object,
            required: true,
        }
    },
    computed: {
        createdAt() {
            const dt = new Date();
            const addedTime = new Date(this.comment.createdAt);

            let diffTime = Math.ceil(Math.abs(addedTime - dt) / (1000 * 60));
            let suffix = "minut"
            let value = diffTime;

            if(value > 60) {
                value = Math.round(diffTime / 60);
                suffix = "godzin"
            } 
            
            if(value > 24 && suffix == "godzin") {
                value = Math.round(value / 24);
                suffix = "dni";
            }

            if(value > 30 && suffix == "dni") {
                value = Math.round(value / 30);
                suffix = "miesięcy";
            }

            if(value > 12 && suffix == "miesięcy") {
                value = Math.round(value / 12);
                suffix = "lat"
            }

            return {
                value,
                suffix,
            }
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        addSubcomment() {
            this.errors = {};
            this.subcomment.loading = true;
            this.$http.post(`http://192.168.43.5:3000/api/comment/${this.comment._id}/sub-comment/`, {
                comment: this.subcomment.model,
            })
                .then(res => {
                    this.subcomment.loading = false;
                    this.subcomment.model = "";
                    console.log(res.data);
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.errors = err.response.data.errors;
                    this.subcomment.loading = false;
                })
        }
    }
}
</script>

<style lang="scss">
.comment.reply {
    margin-left: 3rem;
    border-left: 1px solid #ddd;
}
</style>