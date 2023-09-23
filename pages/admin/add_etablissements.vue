
<script setup>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'


definePageMeta({
  layout: "admin",
});
const { postData } = useAxios();
const label = ref('');
const is_prive = ref('');


const resetForm = () => {
  label.value = '';
  is_prive.value = '';

}
const snackbar = ref({
  show: false,
  message: '',
  color: '',
});
const handleSubmit = async () => {
  const payload = {
    labelle_fr: label.value,
    labelle_ar: label.value,
    labelle_en: label.value,
    is_prive: is_prive.value,
    type_etablissement_id: 1,
  };



  // Make the POST request
  try {
    await postData('https://api.srtk.com.tn/api/etablissemnt/add', payload);
    resetForm();
    snackbar.value = {
      show: true,
      message: 'Registration successful!',
      color: 'success',
    };

  } catch (error) {
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
        <VTextField v-model="label" prepend-inner-icon="mdi-office-building" label="Label" placeholder="Enter Label" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="is_prive" prepend-inner-icon="mdi-office-building" label="Is Private"
          placeholder="Enter Is Private" />
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