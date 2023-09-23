<template>
    <v-card style="padding:30px;">
        <v-form @submit.prevent="handleSubmit">
            <v-text-field v-model="inputValue" label="Code Abonnement" required></v-text-field>
            <v-btn type="submit">Envoyer</v-btn>
        </v-form>
        <a href="https://api.srtk.com.tn/api/admin/clonepay" target="blank"><v-btn
                style="background-color:rgb(44, 133, 228);color:white;float:right;position: absolute; right:30px;bottom:25px;"
                type="submit">Clone
                paiement</v-btn></a>
    </v-card>
</template>
<script setup>
import { useRouter } from 'vue-router';
definePageMeta({
    layout: "admin",
});

const router = useRouter();
let inputValue = '';

function handleSubmit() {
    if (inputValue) {
        const url = `https://api.srtk.com.tn/api/admin/verifpay?code=${inputValue}`;
        window.location.href = url;
    }
}



</script>

<style lang="scss" scoped></style>