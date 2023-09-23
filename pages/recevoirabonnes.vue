<template>
  <div class="container">
    <p class="subscription-status">
      <span v-if="isLoading" class="red-text">Chargement...</span>
      <span v-else>L'état de l'abonnement est :
        <span class="subscription-state red-text">{{ etat }}</span></span>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
definePageMeta({
  layout: "p",
});
// Définition des variables réactives
const etat = ref(""); // Variable pour stocker l'état de l'abonnement
const isLoading = ref(true); // Variable pour suivre l'état du chargement

// Fonction pour récupérer les données des abonnés depuis l'API
async function fetchAbonnesData() {
  try {
    const response = await axios.get(
      `https://api.srtk.com.tn/api/abonnes?code=${localStorage.getItem("code")}`
    );

    if (response.status === 200) {
      const code = response.data.abonnes.data[0];

      if (code) {
        etat.value = code.etat; // Mettre à jour la variable 'etat' avec la valeur reçue de l'API
      } else {
        console.error("Objet code n'existe pas.");
      }
    } else {
      console.error("API call failed.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    isLoading.value = false; // Mettre isLoading à false quelle que soit la sortie de la requête
  }
}

// Appeler fetchAbonnesData lors du montage du composant
onMounted(() => {
  fetchAbonnesData();
});
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.subscription-status {
  font-size: 24px;
}

.subscription-state {
  color: black;
  /* Mettre la couleur du texte en noir */
}

.red-text {
  color: red;
}
</style>
