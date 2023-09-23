<template>
  <div>
    <v-card>
      <v-card-title class="title" style="text-align: center; color: #333">
        Paramètres du compte parents
      </v-card-title>
      <v-card-text class="dialog-body">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedParent.email" prepend-inner-icon="mdi-at" label="Email"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="oldPassword" prepend-inner-icon="mdi-lock"
                :type="showOldPassword ? 'text' : 'password'" :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showOldPassword = !showOldPassword" label="Ancien mot de passe"></v-text-field>
            </v-col>




            <v-col cols="12">
              <v-text-field v-model="editedParent.password" prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword" label="Nouveau mot de passe"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" color="secondary" @click="updateParentDetails">Mettre à jour</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>

definePageMeta({
  layout: "parent",
});
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
import { useAdminStore } from "@/store/auth";
export default {
  data() {
    return {
      editedParent: {
        id: null, // Make id dynamic and initialize it as null
        email: "",
        password: "",
      },
      oldPassword: "", // Nouvelle propriété pour l'ancien mot de passe
      showOldPassword: false, // Pour afficher/masquer l'ancien mot de passe
      showPassword: false, // Pour afficher/masquer le nouveau mot de passe
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

    this.editedParent.email = localStorage.getItem('email');

  },
  methods: {
    editParent(parent) {
      this.editedParent.id = parent.id;
      this.editedParent.email = parent.email;
      this.editedParent.password = parent.password;

    },

    updateParentDetails() {
      if (!this.editedParent.email || !this.editedParent.password || !this.oldPassword) {
        this.snackbar.message = "Veuillez remplir tous les champs.";
        this.snackbar.color = "error";
        this.snackbar.show = true;
        return;
      }
      if (this.editedParent.password.length < 6) {
        this.snackbar.message =
          "Le mot de passe doit contenir au moins 6 caractères.";
        this.snackbar.color = "error";
        this.snackbar.show = true;
        return;
      }

      // Add a new validation check for old password
      if (!this.oldPassword) {
        this.snackbar.message = "Veuillez fournir l'ancien mot de passe.";
        this.snackbar.color = "error";
        this.snackbar.show = true;
        return;
      }
      const axios = this.$axios;
      const token =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("token")
          : null;
      const updateParentUrl =
        `https://api.srtk.com.tn/api/admin/parent/update/` +
        window.localStorage.getItem("cin");

      axios
        .put(
          updateParentUrl,
          {

            email: this.editedParent.email,
            password: this.editedParent.password,
            oldPassword: this.oldPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          if (response.data.success) {
            this.snackbar.message = "Parent updated successfully";
            this.snackbar.color = "success";
            this.snackbar.show = true;

            this.editedParent.email = "";
            this.editedParent.password = "";
            this.oldPassword = "";
          } else {
            this.snackbar.message = response.data.message;
            this.snackbar.color = "error";
            this.snackbar.show = true;
          }
        })

        .catch((error) => {

          this.snackbar.message = "L'ancien mot de passe est incorrect";
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
