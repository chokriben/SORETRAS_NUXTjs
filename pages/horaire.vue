<template>
    <!-- loading="blue-darken-1" -->
    <v-container style="width:50%">
        <v-card :title="$t('widget.horaires')" class="shadow" subtitle="Régionaux et Interurbain">
            <v-tabs v-model="tab" class="tab">
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
    </v-container>
</template>

<script>
definePageMeta({
    layout: "p",
});
export default {
    data: () => ({
        tab: null,
    }),
    mounted() {
        this.$nextTick(() => {
            this.$pagename = this.$t('horaire.title'); // Mettez à jour la valeur de la variable globale
            const titleElement = document.getElementById("title");

            titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
        });
    },
}
</script>

<style lang="scss" scoped>
.shadow:hover {
    box-shadow: 0px 0px 7px 0px;
}

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

.tab {
    background: linear-gradient(to top, #0255a2, #1414ff);
}

.tab:hover {
    background: linear-gradient(to bottom, #1f90fa, #1414ff);
}
</style>