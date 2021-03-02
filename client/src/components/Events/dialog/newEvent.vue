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
            />

            <p class="ma-0 mt-3">
                <v-icon>mdi-calendar</v-icon>
                Data wydarzenia
            </p>

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
                accept="image/png, image/jpeg, image/jpg"
                :rules="rules"
                v-model="event.image"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "NewEvent",
    data() {
        return {
            event: {},
            rules: [
                value => !value || value.size < 4000000 || "Wielkość obrazu nie może przekraczać 4MB"
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
    }
}
</script>

<style>

</style>