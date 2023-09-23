<template>
  <nav>
    <ul>
    
      <li v-if="currentPage > 1" @click="previousPage">Previous</li>
      <li v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)" :class="{ active: pageNumber === currentPage }">
        {{ pageNumber }}
      </li>
      <li v-if="currentPage < totalPages" @click="nextPage">Next</li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
      }
    },
    goToPage(pageNumber) {
      // Implémentez ici la logique pour naviguer vers la page spécifiée
      // Par exemple, vous pouvez émettre un événement personnalisé avec le numéro de page
      this.$emit('go-to-page', pageNumber);
    }
  }
};
</script>

<style scoped>
/* Ajoutez ici votre CSS personnalisé pour la pagination */
</style>
