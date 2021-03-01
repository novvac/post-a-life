<template>
    <div class="event-details">
        <v-img src="../../../assets/event-bg-1.png" height="300px"></v-img>

        <div class="pa-5">
            <div class="d-flex">
                <v-icon>mdi-star</v-icon>
                <span class="text-h5 font-weight-bold black--text ml-3">Nazwa nowego wydarzenia</span>
            </div>

            <div class='mt-4 mt-md-2 d-md-flex align-center justify-space-between'>
                <div class="text-center text-md-left">
                    <v-chip class="caption chip" small>
                        <v-icon x-small class="mr-2">mdi-eye</v-icon>
                        <span>42</span>
                        <div class="ml-1 d-none d-md-block">zainteresowanych</div>
                    </v-chip>

                    <v-chip class="caption chip ml-2" small>
                        <v-icon x-small class="mr-2">mdi-check</v-icon>
                        <span>92</span>
                        <div class="ml-1 d-none d-md-block">weźmie udział</div>
                    </v-chip>
                </div>

                <div class="mt-5 mt-md-0">
                    <v-btn class="caption text-none button" text>
                        <v-icon small class="mr-2">mdi-eye</v-icon>
                        Zainteresowany
                    </v-btn>
                    <v-btn class="caption text-none ml-3 button" text>
                        <v-icon small class="mr-2">mdi-check</v-icon>
                        Wezmę udział
                    </v-btn>
                </div> 
            </div>

            <div class="text-justify mt-4">
                <b>Opis</b><br>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quas aspernatur quidem quam consequuntur dolore ab commodi voluptatum rerum fugit doloremque tempore, possimus nulla assumenda at inventore? Nam, necessitatibus quibusdam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga aperiam repellat debitis cupiditate voluptatibus perferendis, voluptatum id ipsa laborum? Minima, doloremque iste. Repellat, corrupti earum nobis a sequi maiores adipisci.
            </div>

            <div class="d-flex justify-end mt-5 mt-md-0">
                <v-btn class="caption text-none button grey lighten-4" text>
                    <v-icon small class="mr-2">mdi-bullhorn</v-icon>
                    Zaproś znajomych
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "EventDetails"
}
</script>

<style>

</style>