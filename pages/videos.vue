<template>
  <v-card>
    <v-window v-model="tab">
      <v-window-item>
        <v-container fluid>
          <v-row>
            <v-col v-for="(image, imageIndex) in getImageListForPage(
              images,
              currentPage
            )" :key="imageIndex" cols="12" md="4">
              <v-img height="240" :src="`/images/cam/${image.src}`" aspect-ratio="1" cover></v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-pagination v-model="currentPage" :length="getPageCount(images)" class="my-4"></v-pagination>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
export default {
  data() {
    return {
      tab: 0,
      currentPage: 1,
      imagesPerPage: 6,
      images: [],
    };
  },

  methods: {
    truncateText(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
      }
      return text;
    },
    async fetchComm() {
      try {
        const response = await axios.get(
          "https://api.srtk.com.tn/api/video_front/img"
        );
        this.images = response.data.medias; // Stockez les valeurs de actualites dans items
        //console.log(this.images);
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: "Échec du chargement des actualités!",
          color: "error",
        };
      }
    },
    getImageListForPage(imageList, page) {
      const startIndex = (page - 1) * this.imagesPerPage;
      const endIndex = startIndex + this.imagesPerPage;
      return imageList.slice(startIndex, endIndex);
    },
  },
  created() {
    this.fetchComm();
  },
  computed: {
    getPageCount() {
      return (imageList) => Math.ceil(imageList.length / this.imagesPerPage);
    },
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

<style lang="scss" scoped>
.p-banner {
  padding-inline-start: 0 !important;
  padding-inline-end: 0 !important;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
