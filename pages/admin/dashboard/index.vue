<template>
    <v-container fluid>
        <VRow class="match-height">
            <VCol cols="12" md="12">
                <Transaction />
            </VCol>
        </VRow>
        <VRow class="match-height">
            <VCol cols="12" md="12">

                <AnalyticsDatatable />
            </VCol>
        </VRow>
    </v-container>
</template>

<script setup>

definePageMeta({
    layout: "admin",
    //middleware: 'auth'
});

const token = useCookie('token')
if (!token) {
    navigateTo('/admin/auth/login')
}

</script>
<style lang="scss" scoped></style>