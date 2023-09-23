<template>
    <!-- loading="blue-darken-1" -->
    <v-card>
        <v-card-title>{{ $t('widget.horaires') }}</v-card-title>
        <v-card-subtitle>Régionaux et Interurbain</v-card-subtitle>
        <v-tabs v-model="tab" style="background: linear-gradient(to top, #0255a2, #1414ff) ;">
            <v-tab value="1" class="n">{{ $t('widget.regionaux') }}</v-tab>
            <v-tab value="2" class="n">{{ $t('widget.interurbain') }}</v-tab>

        </v-tabs>

        <v-card-text>
            <v-window v-model="tab">
                <v-window-item value="1">
                    <v-autocomplete clearable placeholder="Départ" :items="['Sbitla', 'Tala', 'Kasserine']"
                        variant="solo"></v-autocomplete>
                    <v-autocomplete clearable placeholder="Arrivée" :items="['Sbitla', 'Tala', 'Kasserine']"
                        variant="solo"></v-autocomplete>
                    <v-col cols="12">

                    </v-col>

                </v-window-item>

                <v-window-item value="2">
                    <v-autocomplete clearable label="Départ" :items="['Sbitla', 'Tala', 'Kasserine']"
                        variant="solo"></v-autocomplete>
                    <v-autocomplete clearable label="Arrivée" :items="['Sbitla', 'Tala', 'Kasserine']"
                        variant="solo"></v-autocomplete>
                    <v-col cols="12">

                    </v-col>

                </v-window-item>

            </v-window>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="#0383ff">{{ $t('contact.sendButton') }}</v-btn>
            </v-card-actions>
        </v-card-text>


    </v-card>
</template>

<script>
export default {
    data: () => ({
        tab: null,
    }),

}
</script>

<style lang="scss" scoped>
.n {
    font-size: 14px;
    text-transform: capitalize;
    width: 50%;
    font-weight: 500;
    color: white;
}

.n:hover {
    color: #000
}
</style>