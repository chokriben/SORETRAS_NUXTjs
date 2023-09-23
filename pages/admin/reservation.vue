<script setup>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'

definePageMeta({
  layout: "admin",
});

const { postData } = useAxios();
const successMessage = ref('');
const errorMessage = ref('');
const cin = ref('');
const nom = ref('');
const date_reservation = ref('');
const email = ref('');
const depart = ref('');
const destination = ref('');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const snackbar = ref({
  show: false,
  message: '',
  color: '',
});

const resetForm = () => {
  cin.value = '';
  nom.value = '';
  email.value = '';
  depart.value = '';
  destination.value = '';
  date_reservation.value = '';
}

const handleSubmit = async () => {
  if (!emailRegex.test(email.value)) {
    snackbar.value = {
      show: true,
      message: "Email is not valid!",
      color: "error",
    };
    resetForm();
    return;
  }

  const payload = {
    cin: cin.value,
    nom: nom.value,
    email: email.value,
    depart: depart.value,
    destination: destination.value,
    date_reservation: date_reservation.value,
  }

  try {
    await postData('https://api.srtk.com.tn/api/reservation/add', payload)

    snackbar.value = {
      show: true,
      message: 'Registration successful!',
      color: 'success',
    };
    resetForm();
  } catch (error) {
    console.error(error)
    errorMessage.value = 'An error occurred while inserting data.'
  }
}


</script>




<template>
  <div>

  </div>
  <VForm @submit.prevent="handleSubmit">


    <VSnackbar v-model="snackbar.show" :color="snackbar.color" vertical="top" horizontal="center">
      {{ snackbar.message }}
    </VSnackbar>





    <VRow>

      <VCol cols="6">
        <VTextField v-model="cin" prepend-inner-icon="mdi-card-account-details" label="CIN" placeholder="Numéro de CIN" />
      </VCol>




      <VCol cols="6">
        <VTextField v-model="nom" prepend-inner-icon="mdi-account-outline" label="Nom" placeholder="Nom" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="email" prepend-inner-icon="mdi-email-outline" label="Email" type="email"
          placeholder="Email" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="destination" prepend-inner-icon="mdi-map-marker" label="Destination"
          placeholder="Destination" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="depart" prepend-inner-icon="mdi-airplane-takeoff" label="Départ" placeholder="Départ" />
      </VCol>
      <VCol cols="6">

        <VTextField v-model="date_reservation" prepend-inner-icon="mdi-calendar" label="Date de réservation"
          placeholder="Date de réservation" />
      </VCol>

      <VCol cols="12">

        <VBtn type="submit" class="me-2">
          SUBMIT
        </VBtn>
        <VBtn color="secondary" type="reset" variant="tonal">
          RESET
        </VBtn>
      </VCol>
      <VCol cols="12" v-if="successMessage">
        {{ successMessage }}
      </VCol>
      <VCol cols="12" v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </VCol>
    </VRow>
  </VForm>
</template>

<style lang="scss" scoped>
.error-message {
  color: red;
}
</style>
