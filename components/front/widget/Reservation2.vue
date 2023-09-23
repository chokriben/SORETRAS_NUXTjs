<template>
    <v-card class="mx-auto mt-2" max-width="500">
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
            <v-btn v-if="step < 3" variant="outlined" color="#ff6b35" @click="step++">
                {{ $t('menu.suivant') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    data: () => ({
        step: 1,
    }),

    computed: {
        currentTitle() {
            switch (this.step) {
                case 1: return 'CIN'
                case 2: return 'Horaires'
                default: return 'Demande Envoyée'
            }
        },
    },
}
</script>