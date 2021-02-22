<template>
    <div class="discussion">
        <comment
            :comment="comment"
        />

        <v-row class="ma-0 caption" align="center" v-if="comment.subComments.length > 0">
            <v-btn
                small text
                class="caption text-none grey lighten-4"
                @click="toggleSubcomments()"
            >
                <span v-if="subComments.length == 0">Pokaż odpowiedzi ({{comment.subComments.length}})</span>
                <span v-else>Ukryj odpowiedzi ({{comment.subComments.length}})</span>
            </v-btn>
            
            <v-spacer></v-spacer>
            
            <div class="ml-5 d-flex align-center" v-if="subComments.length > 0">
                <span class="mr-5">{{subComments.length}} z {{comment.subComments.length}}</span>

                <v-btn
                    small text
                    class="caption text-none grey lighten-4"
                    v-if="subComments.length < comment.subComments.length"
                    @click="loadSubComments()"
                    :loading="loading"
                    :disabled="loading"
                >
                    Więcej
                </v-btn>
            </div>
        </v-row>

        <div class="d-flex justify-center my-3" v-if="loading">
            <v-progress-circular
                size="24"
                color="primary"
                indeterminate
            />
        </div>

        <div class="d-flex flex-column-reverse">
            <comment
                v-for="sub in subComments"
                :key="sub._id"
                :comment="sub"
                reply
            />
        </div>
    </div>
</template>

<script>
import {
    mapActions
} from 'vuex';

export default {
    name: 'Discussion',
    props: {
        comment: {
            type: Object,
            required: true,
        },
        timestamp: {
            type: Number,
            required: true,
        }
    },
    data() {
        return {
            loading: false,
            limit: 5,
            skip: 0,
            subComments: [],
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        loadSubComments() {
            this.loading = true;
            const url = `http://192.168.43.5:3000/api/comment/${this.comment._id}/sub-comments/${this.skip}-${this.limit}/${this.timestamp}`;
            this.$http.get(url)
                .then(res => {
                    this.subComments = this.subComments.concat(res.data.subComments);
                    this.skip += this.limit;
                    this.loading = false;
                })
                .catch(err => {
                    if(err.response.status === 401)
                        return this.LOGOUT();

                    console.log(err);
                    this.loading = false;
                })
        },
        toggleSubcomments() {
            if(this.subComments.length > 0) {
                this.subComments = [];
            } else {
                this.skip = 0;
                this.loadSubComments();
            }
        }
    },
    components: {
        Comment: () => import('@/components/Home/comment')
    }
}
</script>

<style>

</style>