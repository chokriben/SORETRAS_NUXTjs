<template>
  <v-container>
    <v-card class="new">
      <v-card-title class="text-center" style="font-size: 14px; font-weight: 600">
        tapez votre message
      </v-card-title>
      <v-card-subtitle class="text-center">
        Année scolaire :{{ currentYear }}-{{
          currentYear + 1
        }}
        :</v-card-subtitle>
      <v-form @submit.prevent="etudiant_form" class="m-3">
        <v-snackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor">
          {{ snackbarMessage }}
        </v-snackbar>

        <!-- Connect the code field to the data property -->
        <v-text-field v-model="code" label="Code  SMS *" required>
        </v-text-field>

        <v-btn type="submit" color="#1414ff" class="bt-ics font-weight-bold ml-auto m-3 login text-body-2">
          Envoyer
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios"; // Import Axios library
import { useAdminStore } from "@/store/auth";

definePageMeta({
  layout: "p",
});

export default {
  data: () => ({
    code: "", // Data property to store the code field value
    snackbarColor: "success",
    snackbarMessage: "",
    showSnackbar: false,
  }),
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    async etudiant_form() {
      try {
        const currentUrl = new URL(window.location.href);

        // Get the value of the 'code' parameter from the query string
        const cin1 = currentUrl.searchParams.get("cin");
        // Make an API call to execute the store function on the server-side
        const response = await axios.post("https://api.srtk.com.tn/api/loginc", {
          code: this.code,
          cin: cin1, // Send the code value in the request body
        });

        if (response.status === 200) {
          const token = response.data.token;
          this.snackbarMessage = "Code valide";
          this.snackbarColor = "success"; // Set the snackbar color to success
          this.showSnackbar = true;
          // Utilisez les données récupérées pour effectuer des actions
          const adminStore = useAdminStore();
          adminStore.setCode(this.code);
          localStorage.setItem("token", token);

          // Wait for a short moment before navigating
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Naviguez vers la page suivante en utilisant le routeur Vue.js
          this.$router.push(`/parent/login?code=${this.code}`);
        } else {
          // Handle unexpected response statuses
          this.handleApiError("Une erreur s'est produite");
        }
      } catch (error) {
        // Handle API call errors
        this.handleApiError(error);
      }
    },
    handleApiError(error) {
      if (error.response && error.response.status === 404) {
        this.snackbarColor = "error";
        this.snackbarMessage = "Code incorrect";
      } else {
        this.snackbarMessage = "Une erreur s'est produite";
      }
      this.showSnackbar = true;
    },
  },
};
</script>

<style>
/* ... Your existing styles ... */
</style>
