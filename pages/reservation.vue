<template>
    <v-container>
        <v-card class="mx-auto mt-2 shadow" max-width="700">
            <v-card-title class="text-h6 font-weight-regular justify-space-between">
                <span>Réservation <v-badge color="rose" :content="step" inline></v-badge></span>

            </v-card-title>
            <v-card-subtitle>
                Réserver votre ticket
            </v-card-subtitle>

            <v-window v-model="step">
                <v-window-item :value="1">
                    <v-card-text>
                        <v-text-field label="CIN" placeholder="CIN"></v-text-field>
                        <span class="text-caption text-grey-darken-1">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </span>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value="2">
                    <v-card-text>
                        <v-autocomplete clearable label="Départ" :items="['Sbitla', 'Tala', 'Kasserine']"
                            variant="solo"></v-autocomplete>
                        <v-autocomplete clearable label="Arrivée" :items="['Sbitla', 'Tala', 'Kasserine']"
                            variant="solo"></v-autocomplete>
                    </v-card-text>
                </v-window-item>

                <v-window-item :value="3">
                    <div class="pa-4 text-center">
                        <h3 class="text-h6 font-weight-light mb-2">
                            Demande Envoyée
                        </h3>
                        <span class="text-caption text-grey">Merci !</span>
                    </div>
                </v-window-item>
            </v-window>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn v-if="step > 1" variant="text" @click="step--">
                    Précedent
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="step < 3" variant="outlined" color="#0383ff" @click="step++">
                    {{ $t('menu.suivant') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
definePageMeta({
    layout: "p",
});
export default {
    data() {
        return {
            step: 1,
        };
    },

    computed: {
        currentTitle() {
            switch (this.step) {
                case 1:
                    return "CIN";
                case 2:
                    return "Horaires";
                default:
                    return "Demande Envoyée";
            }
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.$pagename = this.$t('reservation.title'); // Mettez à jour la valeur de la variable globale
            const titleElement = document.getElementById("title");

            titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
        });
    },
};
</script>

<style>
.shadow:hover {
    box-shadow: 0px 0px 7px 0px;
}
</style>