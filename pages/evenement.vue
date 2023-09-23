<template>
  <v-container>
    <EventCard />
  </v-container>
</template>
<script>
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';
import Pagination from '~/components/Pagination.vue';
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export default {
  mounted() {
    this.$nextTick(() => {
      this.$pagename = this.$t('event.title');; // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");

      titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"

    });
  },
}
</script>