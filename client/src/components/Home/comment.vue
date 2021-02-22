<template>
    <div :class="['comment', 'py-3', 'px-4', reply ? 'reply' : undefined]">
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
                    <b>{{comment.owner.firstName}} {{comment.owner.lastName}}</b>
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

            <base-menu :close-on-content-click="false" min-width="30%">
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
                        hide-details
                        class="caption"
                        :prefix="'@' + comment.owner.firstName + ' ' + comment.owner.lastName "
                    />
                </base-card>
            </base-menu>

            <v-spacer></v-spacer>

            <v-btn x-small text class="caption text-capitalize ml-2" v-if="comment.subComments.length > 0">
                <span>Odpowiedzi (0)</span>
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "Comment",
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
                value = Math.floor(diffTime / 60);
                suffix = "godzin"
            } 
            
            if(value > 24 && suffix == "godzin") {
                value = Math.floor(value / 24);
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
    }
}
</script>

<style lang="scss">
.comment.reply {
    margin-left: 3rem;
    border-left: 1px solid #ddd;
}
</style>