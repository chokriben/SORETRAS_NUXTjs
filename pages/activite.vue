<template>
  <v-container>
    <v-row>
      <v-col v-for="(item, index) in displayedItems" :key="index" cols="12" md="6">
        <!-- Your existing code for v-col -->
        <v-hover v-slot="{ isHovering, props }" close-delay="50">
          <v-card :elevation="isHovering ? 16 : 2" :class="{ 'on-hover': isHovering }" class="mx-auto" height="315"
            max-width="350" v-bind="props">
            <v-img class="align-end text-black" height="200" :src="`/images/cam/${item.img} `" cover>
            </v-img>


            <v-card-text>
              <div style="height: 25px;">{{ item.title }}</div>
            </v-card-text>

            <v-card-actions class="mb-2  col-12">
              <v-btn block variant="outlined" color="#0383ff">
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>

    </v-row>

    <v-pagination v-model="currentPage" :length="totalPages" @input="updateDisplayedItems"></v-pagination>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      items: [
        // Your items to display
        { title: "TRANSPORT URBAIN ", img: '5.jpg', description: "Scolaire / Ordinaire", locations: "" },
        { title: "TRANSPORT RÉGIONAL ET INTERURBAIN", img: '18.jpg', description: "Scolaire / Ordinaire", locations: "" },
        { title: "LOCATION URBAIN ", img: '7.jpg', description: "Scolaire / Ordinaire", locations: "" },
        { title: "LOCATION INTERURBAIN", img: '9.jpg', description: "Scolaire / Ordinaire", locations: "" },
        // Add other items
      ],
      itemsPerPage: 6, // Number of items to display per page
      currentPage: 1, // Current page number
    };
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
  methods: {
    updateDisplayedItems() {
      // Method to update displayed items based on the current page
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedItems = this.items.slice(startIndex, endIndex);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$pagename = this.$t('activite.title');; // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");

      titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"

    });
  }
};
</script>

<style lang="sass" scoped>
.v-card.on-hover.v-theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>
