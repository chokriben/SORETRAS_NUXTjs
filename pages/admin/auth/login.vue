<script setup>
definePageMeta({
  layout: "auth",
});

import logo from '@/public/images/logo.png'
import { useAdminStore } from '@/store/auth';

const axios = useNuxtApp().$axios
const token = useCookie('token')
const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(false)
const isPasswordVisible = ref(false)
const isLoading = ref(false)
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const gare = ref('')
const adminStore = useAdminStore()

const login = () => {
  if (email.value !== '' && password.value !== '') {
    isLoading.value = true;

    axios.post('/admin/login', {
      email: email.value,
      password: password.value,
    }).then(res => {
      token.value = res.data.data.token;
      //gare.value=res.data.data.user.gare_id;
      localStorage.setItem('token', token.value);

      adminStore.setEmail(email.value);
      localStorage.setItem('gare_id', res.data.data.user.gare_id);
      //adminStore.setGare(res.data.data.user.gare_id);
      adminStore.setUserId(res.data.data.user.id); // Update to set the user ID in the admin store
      localStorage.setItem('userId', res.data.data.user.id); // Ajoutez le userId au local storage
      router.push('/admin/dashboard');

    }).catch(err => {
      isLoading.value = false;
      if (err.response && err.response.status === 401) { // Check if err.response exists before accessing status property
        snackbarMessage.value = 'Mot de passe incorrect';
      } else {
        snackbarMessage.value = 'Une erreur s\'est produite';
      }
      showSnackbar.value = true;

    });
  }
}
</script>


<template>
  <div class="auth-wrapper">
    <Loader v-if="isLoading" :overlayP="isLoading" />
    <div class="auth-card">
      <VCard class="pa-4 pt-7 custom-card">
        <VCardItem class="justify-center">
          <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
            <VImg class="logo" :src="logo" :width="250" />
          </VCardTitle>
        </VCardItem>

        <VCardText class="pt-2">
          <h5 class="text-h5 font-weight-semibold mb-1 text-center">
            <!-- Added 'text-center' class for center alignment -->
            <span class="text-blue">Bienvenue Admin!</span> <!-- Added 'text-green' class for green color -->
          </h5>
          <p class="mb-0">
            Veuillez vous connecter à votre compte
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="login" class="auth-form">
            <div class="input-group">
              <VTextField v-model="email" label="Email" type="email" autocomplete="false" class="input-field"
                :style="{ width: '350px', marginBottom: '20px' }" />
            </div>
            <div class="input-group mt-4">
              <VTextField autocomplete="false" v-model="password" label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" class="input-field"
                :style="{ width: '350px' }" />
            </div>
            <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
              <VCol cols="12" md="6" class="mb-1">
                <VCheckbox v-model="remember" label="Se souvenir de moi" />
              </VCol>

              <VCol cols="12" md="6" class="mb-1">
                <a href="javascript:void(0)">
                  Mot de passe oublié ?
                </a>
              </VCol>
            </div>
            <VSnackbar top v-model="showSnackbar" :timeout="3000" color="error">
              {{ snackbarMessage }}
            </VSnackbar>
            <VBtn block type="submit" class="auth-login-button">
              Se connecter
            </VBtn>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/images/recrutement/srtk_bg.jpg");
  background-size: cover;
  background-position: center;
}

.auth-card {
  max-width: 448px;
  background-color: #e0e0e0;
}

.logo {
  width: 250px;
}

.auth-login-button {
  background-color: #368ff4;
  color: #fff;
}

.input-field {

  height: 40px;
}

@media screen and (max-width: 768px) {
  .auth-card {
    margin: 0 16px;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
  }

  .auth-form>div {
    margin-bottom: 16px;
  }
}
</style>
