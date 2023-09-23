<template>
  <v-container>
    <v-row>
      <v-col v-for="(item, index) in displayedItems" :key="index" cols="12">
        <!-- Your existing code for v-col -->
        <v-hover v-slot="{ isHovering, props }" close-delay="50">
          <v-card :elevation="isHovering ? 16 : 2" :class="{ 'on-hover': isHovering }" class="mx-auto" v-bind="props">
            <v-row>
              <v-col cols="4">
                <v-img class="align-end text-black" :src="`/images/cam/${item.img} `" cover height="170">
                </v-img>
              </v-col>
              <v-col cols="8">
                <v-card-text>
                  <div>{{ item.locations }}</div>
                </v-card-text>
                <v-card-subtitle class="pt-4">{{
                  item.description
                }}</v-card-subtitle>

                <v-card-actions class="mb-2 justify-end">
                  <v-btn variant="outlined" color="#0383ff">
                    {{ $t("menu.voir_plus") }}
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-pagination v-model="currentPage" :length="totalPages" @input="updateDisplayedItems"></v-pagination>
  </v-container>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  data() {
    return {
      items: [], // Utilisez la variable items pour stocker les valeurs de actualites
      snackbar: {
        show: false,
        message: "",
        color: "",
      },
      itemsPerPage: 6,
      currentPage: 1,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$pagename = this.$t("comm_media.title"); // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");

      titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
    });
  },
  methods: {
    truncateText(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
      }
      return text;
    },
    async fetchActualites() {
      try {
        const response = await axios.get(
          "https://api.srtk.com.tn/api/communication_medias_front"
        );
        // variable const
        const actualites = response.data.Comm;
        // Find the translation with the locale "ar"
        if (this.$lang == "") {
          this.$lang = "fr";
        }
        const translation = actualites[0].translations.find(
          (t) => t.locale === this.$i18n.locale
        );
        actualites.forEach((item) => {
          // Find the translation with the locale "ar" for each item
          const translation = item.translations.find(
            (t) => t.locale === this.$i18n.locale
          );

          // Update the item's title and description with the Arabic translation
          item.name = translation.name;
          item.description = translation.description;
        });

        this.items = response.data.Comm; // Stockez les valeurs de actualites dans items
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: "Échec du chargement des appels d'offres!",
          color: "error",
        };
      }
    },
    updateDisplayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedItems = this.items.slice(startIndex, endIndex);
    },
  },

  created() {
    this.fetchActualites();
  },

  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    displayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.items.slice(startIndex, endIndex);
    },
  },
};
</script>

<style lang="sass" scoped>
.v-card.on-hover.v-theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>
