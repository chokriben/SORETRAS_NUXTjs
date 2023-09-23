<template>
  <div class="recovery-container">
    <VSnackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarMessage }}
    </VSnackbar>


    <!-- Interface de récupération de mot de passe -->
    <v-card class="custom-dialog">

      <v-card-title>Récupération du Code Abonnement</v-card-title>

      <v-card-text>

        <v-col cols="12" sm="12">
          <v-text-field v-model="recoveryCin" label="Entrez votre CIN" required prepend
            prepend-inner-icon="mdi-card-account-details-outline"></v-text-field>
        </v-col>
      </v-card-text>
      <v-card-actions>

        <v-btn @click="recoverPassword" color="primary">
          <v-icon left>mdi-restore</v-icon>
          Récupérer
        </v-btn>
        <v-btn @click="showRecoveryForm = false" color="error">
          <v-icon left>mdi-cancel</v-icon>
          Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";

definePageMeta({
  layout: "p",
});
const showRecoveryForm = ref(false);
const recoveryCin = ref("");
const enabled = ref(false);
const showSnackbar = ref(false);
const snackbarMessage = ref(""); ""
const snackbarColor = ref("");
const token = useCookie("token");
const toggleVisibility = () => {
  const vCard = document.getElementById("v-card");
  if (vCard) {
    vCard.style.display = enabled.value ? "block" : "none";
  }
};
const showPasswordRecoveryForm = () => {
  showRecoveryForm.value = true;
};
const recoverPassword = () => {
  // Récupérer le numéro de CIN saisi
  const cinParam = recoveryCin.value;
  // Check if the CIN is empty
  if (cinParam.trim() === "") {
    snackbarMessage.value = "Veuillez saisir le numéro de CIN.";
    showSnackbar.value = true;
    return; // Exit the function if CIN is empty
  }
  // Check if the CIN has exactly 8 digits
  if (cinParam.length !== 8 || !/^\d{8}$/.test(cinParam)) {
    snackbarMessage.value = "Le numéro de CIN doit comporter exactement 8 chiffres.";
    showSnackbar.value = true;
    return; // Exit the function if CIN is not valid
  }

  // Construire l'URL de récupération avec le numéro de CIN comme paramètre
  const recoveryUrl = `https://api.srtk.com.tn/api/abonne/recover/${cinParam}`;

  // Effectuer la requête HTTP POST pour récupérer le mot de passe en utilisant recoveryUrl
  axios
    .get(recoveryUrl)
    .then((response) => {
      if (response.status === 200) {

        snackbarColor.value = "success";
        snackbarMessage.value = "Le code a été  envoyé par SMS.";


      } else if (response.status === 404) {
        snackbarColor.value = "error";
        snackbarMessage.value = "CIN abonnement  non trouvé.";

      } else {
        snackbarColor.value = "error";
        snackbarMessage.value = "CIN abonnement non trouvé";


      }
      showSnackbar.value = true; // Show the snackbar
    })
    .catch((error) => {
      snackbarMessage.value = "CIN abonnement non trouvé";

      showSnackbar.value = true; // Show the snackbar
      showRecoveryForm.value = true;
      console.error("Erreur lors de la récupération du mot de passe:", error);
    });


  showRecoveryForm.value = false;
};

</script>

<style>
.recovery-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Adjust the height as needed */
}

.center-button {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  /* Adjust the margin as needed */
}

.v-dialog {
  max-width: 600px;
}

/* Personnalisation du style du v-card */
.v-card {
  padding: 20px;
}

/* Personnalisation du style du v-card-title */
.v-card-title {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Personnalisation du style du v-dialog-content */
.v-dialog__content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
  /* Ajustez la hauteur comme nécessaire */
}

/* Personnalisation du style du v-dialog-actions */
.v-dialog__actions {
  justify-content: space-between;
}

td {
  padding: 0 10px !important;
}

.login {
  color: white;
}

.bt-ics {
  font-size: 14px !important;
  text-transform: capitalize;
  background: linear-gradient(to top, #0053a0, #3182ce) !important;
  color: white;
}

.bt-ics:hover {
  background: linear-gradient(to bottom, #0053a0, #4aa2f5) !important;
  color: white;
}

.montant {
  color: red;
}

.form {
  padding: 20px;
}

.eleve {
  background: linear-gradient(to top, #07447e, #2793f8);
  color: white;
}

.non-eleve {
  background-color: white;
}

.icon-ics {
  text-align: center;
  width: 40%;
  margin: 0 auto;
  padding-top: 10px;
  margin-top: 30px;
  background-color: rgba(255, 255, 255, 0.836);
  color: rgb(27, 27, 27);
  box-shadow: 0px 0px 3px 0px;
}

.ico {
  font-size: 70px;
  margin-bottom: 3px;
  color: rgb(129, 129, 129);
}

.icon-ics:hover {
  box-shadow: 0px 0px 5px 0px;
  /* .ico{
        color:#0053a0;
    }  */
}
</style>
