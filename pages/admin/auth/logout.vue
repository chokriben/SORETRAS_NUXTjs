<script setup>
definePageMeta({
    layout: "auth",
    //middleware: "require-auth"
});
//import nuxtStorage from 'nuxt-storage';
//import useAuthStore from '@/store/auth'

import logo from '@/public/images/logo.png'

import authV1MaskLight from '@/assets/images/pages/auth-v1-mask-light.png'
// import authV1Tree2 from '@/assets/images/pages/auth-v1-tree-2.png'
// import authV1Tree from '@/assets/images/pages/auth-v1-tree.png'
const axios = useNuxtApp().$axios
const token = useCookie('token')

//const { signOut } = useAuth()

const isLoading = ref(false)

const logout = () => {
    isLoading.value = true;

    axios.post('/admin/logout', {
        token: token.value
    }).then(() => {
        token.value = null;
        localStorage.removeItem('token');
        isLoading.value = false;
        return navigateTo('/admin/login');
    }).catch(err => {
        isLoading.value = false;
        //console.log(err.response.data.message);
    });
}
</script>

<template>
    <Loader v-if="isLoading" :overlayP="isLoading" />
    <div class="auth-wrapper d-flex align-center justify-center pa-4">
        <VCard class="auth-card pa-4 pt-7" max-width="448">
            <VCardItem class="justify-center">
                <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
                    <VImg class="" :src="logo" :width="250" />
                </VCardTitle>
            </VCardItem>

            <VCardText class="pt-2">
                <h5 class="text-h5 font-weight-semibold mb-1">
                    Déconnexion
                </h5>
                <p class="mb-0">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
            </VCardText>

            <VCardText>
                <VBtn block @click="logout">
                    Se déconnecter
                </VBtn>
            </VCardText>
        </VCard>

        <!-- <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />

        <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" /> -->

        <!-- bg img -->
        <VImg class="auth-footer-mask d-none d-md-block" :src="authV1MaskLight" />
    </div>
</template>

<style lang="scss">
.auth-wrapper {
    min-block-size: calc(var(--vh, 1vh) * 100);
}

.auth-footer-mask {
    position: absolute;
    inset-block-end: 0;
    min-inline-size: 100%;
}

.auth-card {
    z-index: 1 !important;
}

.auth-footer-start-tree,
.auth-footer-end-tree {
    position: absolute;
    z-index: 1;
}

.auth-footer-start-tree {
    inset-block-end: 0;
    inset-inline-start: 0;
}

.auth-footer-end-tree {
    inset-block-end: 0;
    inset-inline-end: 0;
}

.auth-illustration {
    z-index: 1;
}

.auth-logo {
    position: absolute;
    z-index: 1;
    inset-block-start: 2rem;
    inset-inline-start: 2.3rem;
}

.auth-bg {
    background-color: rgb(var(--v-theme-surface));
}
</style>
