<template>
  <div>
    <v-card>
      <v-card-title class="title" style="text-align: center; color: #333">
        Paramètres du compte admin
      </v-card-title>
      <v-card-text class="dialog-body">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="usereditedUser.email" prepend-inner-icon="mdi-at" label="Email"></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="oldPassword" prepend-inner-icon="mdi-lock"
                :type="showOldPassword ? 'text' : 'password'" :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showOldPassword = !showOldPassword" label="Ancien mot de passe"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="newPassword" prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"
                label="Nouveau mot de passe"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="updateUserDetails">Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>
const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
definePageMeta({
  layout: "admin",
});

export default {
  data() {
    return {
      userId: null, // Ajoutez la variable userId ici
      usereditedUser: {
        email: "", // Initialisez avec une valeur par défaut si nécessaire

      },

      newPassword: "", // Track the new password
      oldPassword: "", // Track the old password
      showOldPassword: false,
      showPassword: false,
      snackbar: {
        show: false,
        message: "",
        color: "",
        timeout: 3000,
      },

    };
  },
  created() {
    // Récupérez l'email depuis le localStorage et initialisez usereditedUser.email

    this.usereditedUser.email = localStorage.getItem('email');
    // Récupérez également l'ID de l'utilisateur depuis le localStorage

    this.userId = localStorage.getItem('userId');

  },

  methods: {
    updateUserDetails() {
      if ((this.newPassword && this.newPassword.length < 6)) {
        this.snackbar.message = "Veuillez remplir correctement les champs.";
        this.snackbar.color = "error";
        this.snackbar.show = true;
        return;
      }

      const axios = this.$axios;
      const token = localStorage.getItem("token");



      // Construisez l'objet requestData avec les données à envoyer
      const requestData = {
        email: this.usereditedUser.email,
        old_password: this.oldPassword,
        new_password: this.newPassword,
      };

      const updateuserUrl = `https://api.srtk.com.tn/api/admin/user/update/${this.userId}`;

      axios
        .put(
          updateuserUrl,
          requestData, // Envoyez les données requestData
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          if (response.data.success) {
            this.snackbar.message = "Utilisateur mis à jour avec succès.";
            this.snackbar.color = "success";
            this.snackbar.show = true;

            // Clear fields after successful update
            this.newPassword = "";
            this.oldPassword = "";
          } else {
            if (response.data.message === "Ancien mot de passe incorrect") {
              this.snackbar.message = "Ancien mot de passe incorrect.";
            } else {
              this.snackbar.message = response.data.message;
            }
            this.snackbar.color = "error";
            this.snackbar.show = true;
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            this.snackbar.message = "Ancien mot de passe incorrect.";
          } else {
            this.snackbar.message = "Ancien mot de passe incorrect.";
          }
          this.snackbar.color = "error";
          this.snackbar.show = true;
        });
    },
  },
};
</script>

<style>
.dialog-header {
  background-color: #eee;
  padding: 16px;
}

.dialog-title {
  font-size: 30px;
  color: #05831c;
  position: -ms-page;
}
</style>