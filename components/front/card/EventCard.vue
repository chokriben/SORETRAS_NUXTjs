<template>
  <v-row>
    <v-col v-for="message in displayedMessages" :key="message.time" cols="12" md="6">
      <v-card>
        <v-img height="150" :src="`/images/cam/10.jpg`" cover class="text-white"></v-img>

        <v-card-text>
          <div class="font-weight-bold ms-1 mb-2">{{ message.day }}</div>

          <v-timeline density="compact" align="start">
            <v-timeline-item size="x-small">
              <div class="mb-2">
                <div class="font-weight-normal">
                  <strong>{{ message.name }}</strong> <br>{{ message.date_debut }}
                </div>
                <div>{{ truncateText(message.description) }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        <v-card-action justify="start" class="m-3">
          <v-btn variant="text">{{ $t('menu.voir_plus') }}</v-btn>
        </v-card-action>
      </v-card>
    </v-col>
  </v-row>

  <v-pagination v-model="currentPage" :length="totalPages" @input="updateDisplayedItems"></v-pagination>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      messages: [], // Utilisez la variable messages pour stocker les valeurs de items
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      itemsPerPage: 6,
      currentPage: 1,
    };
  },
  methods: {
    truncateText(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
      }
      return text;
    },
    async fetchActualites() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/evenementss');
        this.messages = response.data.actualites; // Stockez les valeurs de items dans messages
        //console.log(this.messages);
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des actualités!',
          color: 'error',
        };
      }
    },
    updateDisplayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedMessages = this.messages.slice(startIndex, endIndex);
    },
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
  created() {
    this.fetchActualites();
  },
};
</script>
  
  
<style lang="scss" scoped></style>
  