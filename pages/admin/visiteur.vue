<script setup>
import { ref } from 'vue'
import useAxios from '~/hooks/useAxios'
//import Translation from './Translation.vue';

definePageMeta({
  layout: "admin",
});
const { postData } = useAxios();

const cin_parent = ref('');
const email = ref('');
const num_telephone = ref('');
const identifiant_ministere = ref('');
const status = ref('');
const date_naissance = ref('');
const photo_url = ref('');
const date_emission = ref('');
const cin = ref('');
const prenom = ref('');
const nom = ref('');
const adresse = ref('');
const classe = ref('');
const nom_parent = ref('');
const prenom_parent = ref('');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: '',
  color: '',
});

const resetForm = () => {

  cin_parent.value = '';
  email.value = ''
  num_telephone.value = '';
  identifiant_ministere.value = '';
  status.value = '';
  date_naissance.value = '';
  photo_url.value = '';
  date_emission.value = '';
  cin.value = '';
  prenom.value = '';
  nom.value = '';
  adresse.value = '';
  classe.value = '';
  nom_parent.value = '';
  prenom_parent.value = '';
}
const handleSubmit = async () => {

  if (!emailRegex.test(email.value)) {
    snackbar.value = {
      show: true,
      message: "Email is not valid!",
      color: "error",
      position: 'top'
    };

    resetForm();
    return;
  }
  const payload = {
    email: email.value,
    cin_parent: cin_parent.value,
    cin: cin.value,
    num_telephone: num_telephone.value,
    identifiant_ministere: identifiant_ministere.value,
    date_naissance: date_naissance.value,
    photo_url: photo_url.value,
    date_emission: date_emission.value,

    prenom_fr: prenom.value,
    prenom_en: prenom.value,
    prenom_ar: prenom.value,

    nom_parent_fr: nom_parent.value,
    nom_parent_en: nom_parent.value,
    nom_parent_ar: nom_parent.value,

    prenom_parent_fr: prenom_parent.value,
    prenom_parent_en: prenom_parent.value,
    prenom_parent_ar: prenom_parent.value,

    nom_fr: nom.value,
    nom_en: nom.value,
    nom_ar: nom.value,

    adresse_fr: adresse.value,
    adresse_en: adresse.value,
    adresse_ar: adresse.value,

    classe_fr: classe.value,
    classe_en: classe.value,
    classe_ar: classe.value,

    TypeAbonne_id: 1,
    Etablissement_id: 2,
    Abonnement_id: 1
  };

  // Make the POST request
  try {
    await postData('https://api.srtk.com.tn/api/visiteur/add', payload);
    // Handle the success response

    // For example, you can redirect to a success page
    status.value = '';
    email.value = '';
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

      <VCol cols="6">
        <VTextField v-model="num_telephone" prepend-inner-icon="mdi-phone" label="Téléphone " type="number"
          placeholder="Entrer Numero Téléphone " />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="email" prepend-inner-icon="mdi-email-outline" label="Email" type="email"
          placeholder="Email" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="cin_parent" prepend-inner-icon="mdi-card-account-details" label="Cin Parent"
          placeholder="Numéro de CIN Parent" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="cin" prepend-inner-icon="mdi-card-account-details" label="Cin "
          placeholder="Numéro de CIN " />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="identifiant_ministere" prepend-inner-icon="mdi-card-account-details"
          label="identifiant ministere" placeholder="Entrer identifiant ministere" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="date_naissance" prepend-inner-icon="mdi-calendar" label="Date Naissance"
          placeholder="date naissance" />
      </VCol>


      <VCol cols="6">
        <VTextField v-model="date_emission" prepend-inner-icon="mdi-calendar" label="date emission"
          placeholder="date emission" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="photo_url" prepend-inner-icon="mdi-calendar" label="photo url" placeholder="photo url" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="nom" prepend-inner-icon="mdi-office-building" label="Nom" placeholder="Nom" />
      </VCol>

      <VCol cols="6">
        <VTextField v-model="prenom" prepend-inner-icon="mdi-office-building" label="prenom" placeholder="prenom" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="prenom_parent" prepend-inner-icon="mdi-office-building" label="prenom parent"
          placeholder="prenom parent" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="nom_parent" prepend-inner-icon="mdi-office-building" label="nom parent"
          placeholder="nom parent" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="classe" prepend-inner-icon="mdi-office-building" label="classe" placeholder="classe" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="adresse" prepend-inner-icon="mdi-office-building" label="adresse" placeholder="adresse" />
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