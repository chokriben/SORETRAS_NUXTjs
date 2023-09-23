<template>
  <v-container>
    <v-card class="icon-ics card-shadow">
      <span class="mdi mdi-account ico"></span>
      <v-card-title style="margin-top: -20px"></v-card-title>
      <v-card-subtitle>Inscription</v-card-subtitle>
      <v-form @submit.prevent="loginp" class="m-3">
        <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" label="CIN" required>
        </v-text-field>
        <v-text-field prepend-inner-icon="mdi-lock" v-model="password" label="Mot de passe"
          :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword" required></v-text-field>
        <VSnackbar v-model="showSnackbar" :timeout="3000" :color="snackbarColor">
          {{ snackbarMessage }}
        </VSnackbar>

        <v-btn type="submit" color="#1414ff" class="bt-ics font-weight-bold ml-auto m-3 login text-body-2">Se
          connecter</v-btn>

        <router-link to="/inscription">
          <v-btn class="ml-auto m-3 text-body-2 font-weight-bold">
            S'inscrire</v-btn>
        </router-link>

        <!-- Bouton pour afficher l'interface de récupération de mot de passe -->
        <v-btn @click="showRecoveryForm = true" class="ml-auto m-3 text-body-2 font-weight-bold">
          <v-icon left>mdi-restore</v-icon>
          Récupérer le mot de passe
        </v-btn>

        <!-- Interface de récupération de mot de passe dans un v-dialog -->
        <v-dialog v-model="showRecoveryForm" max-width="600" max-height="600">
          <v-card class="custom-dialog">
            <v-card-title class="headline">Récupération de mot de passe</v-card-title>
            <v-card-text>
              <v-text-field v-model="recoveryCin" label="Entrez votre CIN" required
                prepend-inner-icon="mdi-card-account-details-outline"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="recoverPassword" color="primary">
                <v-icon left>mdi-restore</v-icon>
                Récupérer</v-btn>
              <v-btn @click="showRecoveryForm = false" color="error">
                <v-icon left>mdi-cancel</v-icon>
                Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </v-form>
    </v-card>
  </v-container>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAdminStore } from "@/store/auth";
definePageMeta({
  layout: "p",
});
const showPassword = ref(false);
const showRecoveryForm = ref(false);
const recoveryCin = ref("");
const enabled = ref(false);
const showSnackbar = ref(false);
const snackbarMessage = ref("");
const password = ref("");
const snackbarColor = ref("");
const cin = ref("");
const currentYear = ref(new Date().getFullYear());
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
  const recoveryUrl = `https://api.srtk.com.tn/api/parent/recover/${cinParam}`;

  // Effectuer la requête HTTP POST pour récupérer le mot de passe en utilisant recoveryUrl
  axios
    .get(recoveryUrl)
    .then((response) => {
      if (response.status === 200) {

        snackbarColor.value = "success";
        snackbarMessage.value = "Le mot de passe a été généré et envoyé par SMS.";


      } else if (response.status === 404) {
        snackbarColor.value = "error";
        snackbarMessage.value = "CIN Parent non trouvé.";

      } else {
        snackbarColor.value = "error";
        snackbarMessage.value = "CIN Parent non trouvé";


      }
      showSnackbar.value = true; // Show the snackbar
    })
    .catch((error) => {
      snackbarMessage.value = "CIN Parent non trouvé";

      showSnackbar.value = true; // Show the snackbar
      showRecoveryForm.value = true;
      console.error("Erreur lors de la récupération du mot de passe:", error);
    });

  // The following lines are already correct, no changes needed
  // snackbarMessage.value = "Fonctionnalité de récupération du mot de passe en cours de développement.";
  // showSnackbar.value = true;
  showRecoveryForm.value = false;
};
let incorrectAttempts = ref(0);
const maxAttempts = 5; // Set the maximum number of attempts here
const loginp = () => {
  if (cin.value.length !== 8) {
    snackbarMessage.value = "CIN doit avoir 8 chiffres!";
    showSnackbar.value = true; // Show the snackbar
    return;
  }
  axios
    .post("https://api.srtk.com.tn/api/admin/loginp", {
      cin: cin.value,
      password: password.value,
    })
    .then((res) => {
      token.value = res.data.data.token;
      // //console.log(token.value);
      const adminStore = useAdminStore();
      adminStore.setCin(cin.value);

      localStorage.setItem("token", token.value);
      snackbarMessage.value = ""; // Clear the snackbar message
      showSnackbar.value = true; // Show the snackbar
      navigateTo("/parent/list_urbain");
      // Reset incorrect attempts count on successful login
      incorrectAttempts.value = 0;
    })
    .catch((err) => {
      console.error("Erreur de connexion:", err);
      // Increment incorrect attempts count
      incorrectAttempts.value += 1;

      // Check if 5 incorrect attempts have been made
      if (incorrectAttempts.value >= maxAttempts) {

        // Calculate remaining attempts
        const remainingAttempts = maxAttempts - incorrectAttempts.value;
        const message = `Mot de passe incorrect!..Il vous reste ${remainingAttempts} tentative(s).`;
        snackbarMessage.value = message;
        showRecoveryForm.value = true;
      } else {
        if (err.response.status === 404) {
          snackbarColor.value = "error";
          snackbarMessage.value = "Le CIN n'existe pas!";
        } else if (err.response.status === 401) {
          snackbarColor.value = "error";
          // Calculate remaining attempts
          const remainingAttempts = maxAttempts - incorrectAttempts.value;
          const message = `Mot de passe incorrect!..Il vous reste ${remainingAttempts} tentative(s).`;
          snackbarMessage.value = message;
        } else {
          snackbarMessage.value = "Erreur de connexion.";
        }
        showSnackbar.value = true; // Show the snackbar
      }
    });
};
</script>

<style>
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