<script setup>
import { ref } from "vue";
import axios from "axios";
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
definePageMeta({
  layout: "admin",
});

const label = ref("");
const codeetab = ref(null);
const selectedGareId = ref(null);
const uniqueTypes = ref([]);

const etablissemnts = ref([]); // Ajout de la référence pour stocker les établissements
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});

const resetForm = () => {
  label.value = "";
  codeetab.value = "";
  selectedGareId.value = "";
};

const handleSubmit = async () => {
  const payload = {
    labelle_fr: label.value,
    labelle_ar: label.value,
    labelle_en: label.value,
    codeetab: codeetab.value,

    typeetablissement: selectedGareId.value, // Ajoutez la valeur du champ typeetablissement
  };

  try {
    const token = useCookie("token", {
      watch: true,
      HttpOnly: true,
    });
    await axios.post(
      "https://api.srtk.com.tn/api/admin/etablissemnt/add",
      payload,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    ); // Utilisation de axios.post
    resetForm();
    snackbar.value = {
      show: true,
      message: "Registration successful!",
      color: "success",
    };
  } catch (error) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: "Registration failed!",
      color: "error",
    };
  }
};

// Chargement des établissements
const loadEtablissements = async () => {
  const token = useCookie("token", {
    watch: true,
    HttpOnly: true,
  });
  const url = `https://api.srtk.com.tn/api/admin/etablissemnts`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    // Filtrer les types d'établissements uniques
    const types = [
      ...new Set(
        res.data.etablissements.data.map((item) => item.typeetablissement)
      ),
    ];
    etablissemnts.value = res.data.etablissements.data;
    uniqueTypes.value = types;
    // console.log(uniqueTypes.value)
  } catch (err) {
    console.error(err);
  }
};

// Appel à la fonction de chargement des établissements
loadEtablissements();
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}
    </VSnackbar>
    <VRow>
      <VCol cols="6">
        <VTextField v-model="label" prepend-inner-icon="mdi-office-building" label="Label" placeholder="Enter Label" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="codeetab" prepend-inner-icon="mdi-office-building" label="codetype" placeholder="Enter code"
          type="number" />
      </VCol>

      <v-col cols="6" sm="6">
        <select v-model="selectedGareId" class="forms" autocomplete>
          <option value="null">Sélectionnez un type d'établissement</option>
          <option value="Etatique_formation">Etatique_formation</option>
          <option value="Prive_formation">Prive_formation</option>
          <option v-for="(type, index) in uniqueTypes" :key="index">
            {{ type }}
          </option>
        </select>
      </v-col>
      <VCol cols="12">
        <VBtn type="submit" class="me-2"> Submit </VBtn>
        <VBtn color="secondary" type="reset" variant="tonal"> Reset </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style lang="scss" scoped></style>
