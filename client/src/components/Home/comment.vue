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
            <v-btn small icon :color="comment.likes.includes(user._id) ? 'black' : undefined" :disabled="isOwner" @click="isOwner ? undefined : vote(1)">
                <v-icon x-small>mdi-thumb-up</v-icon>
            </v-btn>

            <span
                :class="['mx-1', 'font-weight-bold',
                votes < 0 ? 'red--text' : votes > 0 ? 'success--text' : undefined]"
            >
                {{votes}}
            </span>

            <v-btn small icon :color="comment.dislikes.includes(user._id) ? 'black' : undefined" :disabled="isOwner" @click="isOwner ? undefined : vote(-1)">
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

            <v-btn x-small text class="text-none caption ml-2" color="red" v-if="isOwner" @click="deleteComment()">
                <v-icon x-small>mdi-delete</v-icon>
                Usuń
            </v-btn>
        </div>
    </div>
</template>

<script>
import {
    mapActions,
    mapGetters,
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
        ...mapGetters(['user']),
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
        },
        votes() {
            return (this.comment.likes.length - this.comment.dislikes.length);
        },
        isOwner() {
            return this.comment.owner.short_id === this.user.short_id;
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
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    this.errors = err.response.data.errors;
                    this.subcomment.loading = false;
                })
        },
        vote(type) {
            // ? type:  1   =>  like
            // ? type: -1   =>  dislike

            this.$http.put(`http://192.168.43.5:3000/api/comment/${this.comment._id}/vote/${type}/`)
                .then(res => {
                    const userLike = this.comment.likes.includes(this.user._id);
                    const userDislike = this.comment.dislikes.includes(this.user._id);

                    this.comment.likes.splice(this.comment.likes.indexOf(this.user._id), 1);
                    this.comment.dislikes.splice(this.comment.dislikes.indexOf(this.user._id), 1);

                    if(type === 1) {
                        if(!userLike)
                            this.comment.likes.push(this.user._id);
                    }
                    else if(type === -1) {
                        if(!userDislike)
                            this.comment.dislikes.push(this.user._id);
                    }
                })
                .catch(err => {
                    if(err.response.status === 401)
                        this.LOGOUT();

                    console.log(err);
                })
        },
        deleteComment() {
            this.$http.delete(`http://192.168.43.5:3000/api/comment/${this.comment._id}/`)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    if(err.response.status === 401)
                        this.LOGOUT();

                    console.log(err);
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