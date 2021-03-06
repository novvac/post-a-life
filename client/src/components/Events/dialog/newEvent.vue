<template>
    <div class="new-event">
        <v-divider/>

        <div class="pa-5">
            <h5 class="mb-2 black--text">Tworzenie nowego wydarzenia</h5>

            <v-text-field
                solo
                hint="Nazwa powinna streszczać cel wydarzenia i być zrozumiała dla odbiorcy!"
                persistent-hint
                placeholder="Nazwa wydarzenia"
                class="body-2"
                :counter="64"
                prepend-icon="mdi-format-size"
                v-model="event.title"
                :error="Boolean(errors.title)"
                :error-messages="errors.title"
            />

            <v-textarea
                solo
                placeholder="Opis wydarzenia"
                :counter="1024"
                class="body-2"
                prepend-icon="mdi-pen"
                hint="Podaj szczegóły wydarzenia i zachęć odbiorcę do wzięcia udziału!"
                persistent-hint
                v-model="event.description"
                :error="Boolean(errors.description)"
                :error-messages="errors.description"
            />

            <p class="ma-0 mt-3">
                <v-icon>mdi-calendar</v-icon>
                Data wydarzenia
            </p>

            <span class="red--text d-block" v-if="Boolean(errors.date)" caption>{{errors.date}}</span>

            <v-date-picker
                full-width
                class="mt-1"
                v-model="event.date"
                :min="minDate"
            />

            <v-file-input
                solo
                placeholder="Zdjęcie wydarzenia"
                class="body-2"
                prepend-icon="mdi-camera"
                hint="Dodaj zdjęcie wydarzenia do zwiększenia uwagi odbiorcy!"
                persistent-hint
                clearable
                accept="image/*"
                v-model="selectedFile"
                :rules="rules"
                :error="Boolean(errors.image)"
                :error-messages="errors.image"
            />

            <v-divider class="my-5"></v-divider>

            <v-btn :disabled="loading" :loading="loading" class="success" @click="addEvent()">Utwórz wydarzenie</v-btn>
        </div>
    </div>
</template>

<script>
import {
    mapActions
} from 'vuex';

export default {
    name: "NewEvent",
    data() {
        return {
            event: {},
            selectedFile: null,
            loading: false,
            errors: {},
            rules: [
                value => {
                    if(value && value.size > 2000000)
                        return "Plik jest za duży! Może mieć maksymalnie 2Mb!";
                    return true;
                }
            ]
        }
    },
    computed: {
        minDate() {
            let dt = new Date();

            let today = dt.getFullYear() + "-";

            if(dt.getMonth() + 1 < 10)
                today += "0";
            today += dt.getMonth() + 1 + "-";

            if(dt.getDate() < 10)
                today += "0";
            today += dt.getDate();

            return today;
        }
    },
    methods: {
        ...mapActions(['LOGOUT']),
        ...mapActions(['SET_EVENTS_DIALOG']),
        ...mapActions(['LOAD_USER_EVENTS']),
        addEvent() {
            const formData = new FormData();
            formData.append("event-image", this.selectedFile);

            this.errors = {};
            if(!this.selectedFile) {
                this.errors.image = "Uzupełnij to pole!";
                return;
            }
            if(this.selectedFile.type.substr(0,5) != "image") {
                this.errors.image = "Niepoprawny typ pliku!";
                this.selectedFile = null;
                return;
            }
            this.loading = true;
            this.$http.post("event", this.event).then(res => {
                this.$http.post(`event/${res.data}/image`, formData).then(res => {
                    this.loading = false;
                    this.event = {};
                    this.selectedFile = null;
                    this.SET_EVENTS_DIALOG(null);

                    this.LOAD_USER_EVENTS();
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                if(err.response) {
                    if(err.response.status === 401)
                        return this.LOGOUT();
                }

                this.errors = err.response.data.errors;
                this.loading = false;
            })
        }
    }
}
</script>

<style>

</style>