<template>

        <v-col cols="12" sm="9" class="mx-auto">
            <v-text-field clearable :loading="loading" density="comfortable" variant="solo" label="Chercher..."
                append-inner-icon="mdi-magnify" single-line hide-details @click:append-inner="onClick"></v-text-field>
        </v-col>
</template>

<script>
export default {
    data: () => ({
        loaded: false,
        loading: false,
    }),

    methods: {
        onClick() {
            this.loading = true

            setTimeout(() => {
                this.loading = false
                this.loaded = true
            }, 2000)
        },
    },
}
</script>

<style lang="scss" scoped></style>