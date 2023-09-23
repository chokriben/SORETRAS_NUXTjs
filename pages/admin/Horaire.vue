
<script setup>

import { ref, onMounted, } from 'vue'
import axios from 'axios'

const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
definePageMeta({
  layout: "admin",
});

const departSelected = ref(null);
const arriveSelected = ref(null);
const h_depart = ref('');
const h_arrive = ref('');
const stations = ref([]);
const resetForm = () => {
  departSelected.value = '';
  arriveSelected.value = '';
  h_arrive.value = '';
  h_depart.value = '';

}
const snackbar = ref({
  show: false,
  message: '',
  color: '',
});
const station = stations.value.find(item => item.name === selected.value);
// Fetch stations
async function fetchStations() {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  };
  try {
    const response = await axios.get('https://api.srtk.com.tn/api/admin/stations', { headers });
    stations.value = response.data.stations.data;
    //console.log(stations.value)

  } catch (error) {
    console.error('Error fetching stations:', error);
  }
}
onMounted(() => {
  (async () => {
    await fetchStations();

  })();
});
const filteredStations = computed(() => {
  if (!departSelected.value) return stations.value;
  return stations.value.filter((station) => station.name !== departSelected.value);
});
const handleSubmit = async () => {

  const payload = {
    depart: departSelected.value,
    arrive: arriveSelected.value, // Replace 'arrive.value' with the actual value from the form
    h_depart: h_depart.value.toString(), // Convert h_depart to string format
    h_arrive: h_arrive.value.toString(),

  };



  // Make the POST request
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
    const response = await axios.post('https://api.srtk.com.tn/api/admin/horaire/add', payload, { headers });
    // Handle the success response

    // For example, you can redirect to a success page
    snackbar.value = {
      show: true,
      message: 'Registration successful!',
      color: 'success',
    };
    resetForm();
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



      <v-col cols="12" sm="6">
        <v-select label="Station Depart" :items="filteredStations.map((item) => item.name)" v-model="departSelected"
          item-value="id" item-text="name">
          <template #no-data>
            Aucun station existe
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" sm="6">
        <v-select label="Station Destination" :items="filteredStations.map((item) => item.name)" v-model="arriveSelected"
          item-value="id" item-text="name">
          <template #no-data>
            Aucun station existe
          </template>
        </v-select>
      </v-col>



      <v-col cols="6">
        <v-text-field v-model="h_depart" label="Heure de départ" prepend-inner-icon="mdi-clock" placeholder="Heure" />
      </v-col>


      <v-col cols="6">
        <v-text-field v-model="h_arrive" label=" heure d'arrive" prepend-inner-icon="mdi-clock" placeholder="Heure" />
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