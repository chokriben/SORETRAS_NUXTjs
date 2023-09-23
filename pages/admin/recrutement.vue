
<script setup>
import { ref } from 'vue'
import axios from 'axios'


definePageMeta({
  layout: "admin",
});
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const description = ref('');
const name = ref('');
const date_debut = ref('');
const date_fin = ref('');

const resetForm = () => {
  description.value = '';
  name.value = '';


  date_debut.value = '';
  date_fin.value = '';

}
const snackbar = ref({
  show: false,
  message: '',
  color: '',
});
const handleSubmit = async () => {
  const payload = {
    name_fr: name.value,
    name_ar: name.value,
    name_en: name.value,

    description_fr: description.value,
    description_ar: description.value,
    description_en: description.value,
    user_id: 2,
    ville_id: 2,
    date_debut: date_debut.value,
    date_fin: date_fin.value,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };


  // Make the POST request
  try {
    axios.post('https://api.srtk.com.tn/api/admin/recrutement/add', payload, { headers });
    await postData('https://api.srtk.com.tn/api/recrutement/add', payload);
    // Handle the success response

    // For example, you can redirect to a success page
    resetForm();
    snackbar.value = {
      show: true,
      message: 'Registration successful!',
      color: 'success',
    };

  } catch (error) {
    // Handle the error response
    // You can display an error message or take other actions
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Registration failed!',
      color: 'error',

    };

  }
};
</script>

<template>
  <VForm @submit.prevent="handleSubmit">

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}

    </VSnackbar>
    <VRow>
      <VCol cols="6">
        <VTextField v-model="name" prepend-inner-icon="mdi-office-building" label="Nom" placeholder="Nom" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="description" prepend-inner-icon="mdi-office-building" label="Description "
          placeholder="Description " />
      </VCol>
      <v-col cols="6">
        <v-text-field v-model="date_debut" label=" Date_Debut" prepend-inner-icon="mdi-calendar" placeholder="date" />
      </v-col>

      <v-col cols="6">
        <v-text-field v-model="date_fin" label=" Date_Fin" prepend-inner-icon="mdi-calendar" placeholder="date" />
      </v-col>


      <VCol cols="12">
        <VBtn type="submit" class="me-2">
          Submit
        </VBtn>
        <VBtn color="secondary" type="reset" variant="tonal">
          Reset
        </VBtn>
      </VCol>

    </VRow>
  </VForm>
</template>
<style lang="scss" scoped></style>