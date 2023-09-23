<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="on-hover v-theme--dark">
          <v-card-title>
            {{ name }}
          </v-card-title>
          <v-card-text>
            <div class="content" v-html="content"></div>
          </v-card-text>
          <v-carousel show-arrows="hover" hide-delimiters height="500" style="width: 900px; margin: 0 auto">
            <v-carousel-item v-for="image in images" :key="image" :src="`/images/cam/${image}`" cover></v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
definePageMeta({
  layout: "p",
});

export default {
  data() {
    return {
      name: "",
      content: "",
      images: [], // Ajout d'un tableau pour stocker les images
    };
  },
  methods: {
    renderHtml(content) {
      return { __html: content };
    },
    async fetchData() {
      try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get("id");
        const response = await axios.get(
          "https://api.srtk.com.tn/api/actualite/" + id
        );
        const { success, message, Comm } = response.data;

        if (success) {
          const translation = Comm.translations.find(
            (t) => t.locale === this.$i18n.locale
          );

          if (translation) {
            this.name = translation.name;
            this.content = translation.description;
            this.images = [
              translation.img1,
              translation.img2,
              translation.img3,
            ];
          } else {
            console.error("Translation not found for the selected locale");
          }
        } else {
          console.error(message);
        }
        this.$nextTick(() => {
          this.$pagename = this.name;
          const titleElement = document.getElementById("title");
          titleElement.innerText = this.$pagename;
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="sass" scoped>
.v-card.on-hover.v-theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>
