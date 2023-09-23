<template>
  <v-row>
    <v-col v-for="message in displayedMessages" :key="message.time" cols="12" md="6">
      <v-card>
        <v-img height="150" :src="`/images/cam/${message.img}`" cover class="text-white"></v-img>

        <v-card-text>
          <div class="font-weight-bold ms-1 mb-2">{{ message.day }}</div>

          <v-timeline density="compact" align="start">
            <v-timeline-item size="x-small">
              <div class="mb-2">
                <div class="font-weight-normal">
                  <strong>{{ message.from }}</strong> @{{ message.time }}
                </div>
                <div>{{ message.message }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        <v-card-action justify="start" class="m-3">
          <v-btn variant="text">voir plus</v-btn>
        </v-card-action>
      </v-card>
    </v-col>
  </v-row>

  <v-pagination v-model="currentPage" :length="totalPages" @input="updateDisplayedItems"></v-pagination>
</template>
  
<script>
export default {
  data() {
    return {
      messages: [
        {
          img: '5.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },
        {
          img: '10.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },
        {
          img: '8.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },
        {
          img: '7.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },
        {
          img: '7.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },
        {
          img: '7.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },
        {
          img: '7.jpg',
          day: 'Mardi',
          from: '2023',
          message: `07/03/2023`,
          time: '10:42',
          color: 'deep-purple-lighten-1',
        },

        // Ajoutez les autres messages ici
      ],
      itemsPerPage: 6, // Nombre d'éléments à afficher par page
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.messages.length / this.itemsPerPage);
    },
    displayedMessages() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.messages.slice(startIndex, endIndex);
    },
  },
  methods: {
    updateDisplayedItems() {
      // Méthode pour mettre à jour les messages affichés en fonction de la page actuelle
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedMessages = this.messages.slice(startIndex, endIndex);
    },
  },
};
</script>
  
<style lang="scss" scoped></style>
  