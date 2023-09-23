
<script setup>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'


definePageMeta({
  layout: "admin",
});
const { postData } = useAxios();
const labelle = ref('');
const resetForm = () => {
  labelle.value = '';
}
const snackbar = ref({
  show: false,
  message: '',
  color: '',
});
const handleSubmit = async () => {
  const payload = {
    labelle_fr: labelle.value,
    labelle_ar: labelle.value,
    labelle_en: labelle.value,
  };



  // Make the POST request
  try {
    await postData('https://api.srtk.com.tn/api/typeetablissement/add', payload);
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
        <VTextField v-model="labelle" prepend-inner-icon="mdi-office-building" label="Labelle "
          placeholder="Tapez Labelle " />
      </VCol>
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