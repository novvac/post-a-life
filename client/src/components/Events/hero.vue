<template>
    <div
        class="event-hero pa-5 white--text"
        :style="{backgroundImage: 'url(' + require('../../assets/' + this.src) + ')'}"
    >
        <div class="overlay"></div>

        <div class="content d-flex flex-column justify-space-between">
            <div class="d-flex justify-space-between">
                <div>
                    <v-chip class="caption chip" small>
                        <v-icon x-small class="mr-2">mdi-eye</v-icon>
                        <span>42</span>
                        <div class="ml-1">zainteresowanych</div>
                    </v-chip>

                    <v-chip class="caption chip ml-2" small>
                        <v-icon x-small class="mr-2">mdi-check</v-icon>
                        <span>92</span>
                        <div class="ml-1">weźmie udział</div>
                    </v-chip>      
                </div>

                <v-btn class="caption chip text-none ml-3 button" x-small color="white">
                    <v-icon x-small>mdi-bullhorn</v-icon>
                    <div class="ml-2">Zaproś znajomych</div>
                </v-btn>           
            </div>

            <div>
                <div class="text-h5 font-weight-bold text-truncate">
                    {{event.title}}
                </div>
                <div class="body-2 text-truncate" style="color: #ccc"> 
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto ratione quod nemo deserunt, facere repellendus? Natus autem asperiores blanditiis adipisci, odio molestiae numquam ex optio harum possimus nostrum? Dolor, veritatis?
                </div>
                <div class="d-flex mt-5"> 
                    <v-btn class="caption text-none button" x-small color="white">
                        <v-icon x-small class="mr-2">mdi-eye</v-icon>
                        Zainteresowany
                    </v-btn>
                    <v-btn class="caption text-none ml-3 button" x-small color="white">
                        <v-icon x-small class="mr-2">mdi-check</v-icon>
                        Wezmę udział
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//TODO: move title on hover 

export default {
    name: "EventHero",
    props: {
        src: {
            type: String,
            required: true,
        },
        event: {
            type: Object,
            required: true,
        }
    },
}
</script>

<style lang="scss">
.event-hero {
    border-radius: 22px;
    height: 360px;
    background-size: cover;
    overflow: hidden;
    position: relative;
    box-shadow: 0;
    transition: 300ms;

    .overlay {
        transition: 300ms;
        background: black;
        position: absolute;
        top:0;bottom:0;left:0;right:0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.911) 0%, rgba(0, 0, 0, 0.425) 47%, rgba(0,0,0,0) 100%);
    }

    .content {
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 20px;
        right: 20px;

        .chip {
            transition: 300ms;

            &:hover {
                background: white;
            }
            div {
                display: none;
            }
            &:hover div {
                display: block;
            }
        }
        .button {
            opacity: .9;

            &:hover {
                opacity: 1;
            }
        }
    }
}
</style>