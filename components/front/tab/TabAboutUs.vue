<template>
    <v-card class="mt-15 mb-16">
        <v-tabs v-model="tab" style="background: linear-gradient(to top, #0255a2, #1414ff) ;">
            <v-tab value="one" class="n">{{ $t('widget.a_propos') }}</v-tab>
            <v-tab value="two" class="n">{{ $t('widget.mission') }}</v-tab>
            <v-tab value="three" class="n">{{ $t('widget.objectif') }}</v-tab>
        </v-tabs>

        <!-- <v-card-text> -->
        <v-window v-model="tab" class="mb-5 p-4">
            <v-window-item value="one">

                <div class="content" v-html="content"></div>


            </v-window-item>

            <v-window-item value="two">
                <div class="content" v-html="mission"></div>
            </v-window-item>

            <v-window-item value="three">
                <div class="content" v-html="objectif"></div>
            </v-window-item>
        </v-window>


        <!-- </v-card-text> -->
        <!-- <v-card-action class="mt-4 d-flex justify-end">
            <v-btn variant="outlined" color="#0383ff">voir plus</v-btn>
        </v-card-action> -->
    </v-card>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import useAxios from '~/hooks/useAxios';
import axios from 'axios';
export default {
    data() {
        return {
            tab: null,
            name: '',
            content: '',
            name_mission: '',
            mission: '',
            name_objectif: '',
            objectif: '',
        }
    },
    methods: {
        renderHtml(content) {
            return { __html: content };
        },
        async fetchData() {
            try {
                const response = await axios.get('https://api.srtk.com.tn/api/page/about');
                const { success, message, Securite } = response.data;

                if (success) {
                    const translation = Securite.translations.find(t => t.locale === this.$i18n.locale);

                    if (translation) {
                        this.name = translation.name;
                        this.content = translation.description;

                    } else {
                        console.error('Translation not found for the selected locale');
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchData_mission() {
            try {
                const response = await axios.get('https://api.srtk.com.tn/api/page/mission');
                const { success, message, Securite } = response.data;

                if (success) {
                    const translation = Securite.translations.find(t => t.locale === this.$i18n.locale);

                    if (translation) {
                        this.name_mission = translation.name;
                        this.mission = translation.description;

                    } else {
                        console.error('Translation not found for the selected locale');
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchData_objectif() {
            try {
                const response = await axios.get('https://api.srtk.com.tn/api/page/objectif');
                const { success, message, Securite } = response.data;

                if (success) {
                    const translation = Securite.translations.find(t => t.locale === this.$i18n.locale);

                    if (translation) {
                        this.name_objectif = translation.name;
                        this.objectif = translation.description;

                    } else {
                        console.error('Translation not found for the selected locale');
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.fetchData();
        this.fetchData_mission();
        this.fetchData_objectif();
        this.$nextTick(() => {
            this.$pagename = this.$t('acces_info.title');; // Mettez à jour la valeur de la variable globale
            const titleElement = document.getElementById("title");

            // titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"

        });
    }
}
</script>
<style>
.n {
    font-size: 14px;
    text-transform: capitalize;
    justify-content: space-between;
    font-weight: 500;
    color: white;
}

.n:hover {
    color: black;
}
</style>