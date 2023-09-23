<template>
  <div :class="colorMode" class="custom-container">
    <v-container>
      <v-form @submit.prevent="handleSubmit" class="custom-form">
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" top class="custom-snackbar">
          {{ snackbar.message }}
        </v-snackbar>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="code_debut" label="Code de Début" placeholder="Code de Début" class="custom-text-field"
              prepend-inner-icon="mdi-barcode" type="number">
              <template #label>
                <span class="custom-label">Code de Début:</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="code_fin" label="Code de Fin" placeholder="Code de Fin" class="custom-text-field"
              prepend-inner-icon="mdi-barcode" type="number">
              <template #label>
                <span class="custom-label">Code de Fin:</span>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="code_actuel" label="Code Actuel" placeholder="Code Actuel" class="custom-text-field"
              prepend-inner-icon="mdi-barcode" type="number">
              <template #label>
                <span class="custom-label">Code Actuel:</span>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="6" sm="6">
            <select v-model="selectedUserId" class="custom-select" autocomplete>
              <option value="null">Sélectionnez une région</option>
              <option v-for="user in userss" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </v-col>
          <v-col cols="12">
            <v-btn type="submit" color="green" class="custom-btn" rounded icon>
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn color="blue" type="reset" variant="tonal" rounded icon @click="resetForm" class="custom-btn">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "admin",
});
const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
const csrfToken = ref(null);
const selectedUserId = ref(null);
const users = ref([]);
//const user = ref(null);
const userss = ref([]);
const code_debut = ref("");
const code_fin = ref("");
const code_actuel = ref("");
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "multipart/form-data",
};

const handleSubmit = async () => {
  if (!code_debut.value || !code_actuel.value || !code_fin.value || !selectedUserId.value) {
    snackbar.value = {
      show: true,
      message: "Veuillez remplir tous les champs!",
      color: "error",
      position: "top",
    };
    return;
  }

  try {
    const payload = {
      csrf_token: csrfToken.value,
      code_debut: code_debut.value,
      code_fin: code_fin.value,
      code_actuel: code_actuel.value,
      user_id: selectedUserId.value,
    };

    await axios.post("https://api.srtk.com.tn/api/admin/stock/add", payload, {
      headers: headers,
    });

    snackbar.value = {
      show: true,
      message: " réussie!",
      color: "success",
    };

    resetForm();
  } catch (error) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: "Échec de l'!",
      color: "error",
    };
  }
};

const resetForm = () => {
  code_debut.value = "";
  code_fin.value = "";
  code_actuel.value = "";
  selectedUserId.value = null;
};
const fetchUsers = async () => {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    //users.value = response.data.users.data; // Accédez aux données des utilisateurs avec response.data.users.data
    return (userss.value = response.data.users.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log(users.value)
};



onMounted(() => {
  fetchUsers();

});
</script>
<style scoped>
.custom-container {
  /* Styles for the main container div */
  background-color: #f0f0f0;
  padding: 20px;
}

.custom-form {
  /* Styles for the form */
  margin-top: 20px;
}



.custom-text-field {
  /* Styles for text fields */
  width: 100%;
  margin-bottom: 20px;
}

.custom-label {
  /* Styles for labels */
  font-weight: bold;
}

.custom-select {
  /* Styles for the select input */
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
}

.custom-btn {
  /* Styles for buttons */
  margin-top: 20px;
}
</style>