<script setup>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'
//import Translation from './Translation.vue';

definePageMeta({
  layout: "admin",
});
const { postData } = useAxios();

const status = ref('');
const email = ref('');



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: '',
  color: '',
});
const handleSubmit = async () => {

  if (!emailRegex.test(email.value)) {
    snackbar.value = {
      show: true,
      message: "Email is not valid!",
      color: "error",
      position: 'top'
    };
    status.value = '';
    email.value = '';

    return;
  }
  const payload = {
    status: status.value,
    email: email.value,

  };

  // Make the POST request
  try {
    await postData('https://api.srtk.com.tn/api/admin/email_news_letter/add', payload);
    // Handle the success response

    // For example, you can redirect to a success page
    status.value = '';
    email.value = '';
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
        <VTextField v-model="status" prepend-inner-icon="mdi-office-building" label="status" placeholder="status" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="email" prepend-inner-icon="mdi-email-outline" label="Email" type="email"
          placeholder="Email" />
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