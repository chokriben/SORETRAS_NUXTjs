
<script setup>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'



definePageMeta({
  layout: "admin",
});
const { postData } = useAxios();
const description = ref('');
const name = ref('');


const resetForm = () => {
  description.value = '';
  name.value = '';
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



  };



  // Make the POST request
  try {
    await postData('https://api.srtk.com.tn/api/gallerie/add', payload);
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