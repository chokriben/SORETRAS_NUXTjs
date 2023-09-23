<template>
    <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false">
                Close
            </v-btn>
           
        </template>
    </v-snackbar>
</template>
<script lang="ts">
export default {
    data: () => ({
        snackbar: false,
        text: 'My timeout is set to 2000.',
        timeout: 2000,
    }),
    props: ['snackbarP', 'text'],
    mounted() {
        this.snackbar = this.snackbarP
    }
}
</script>