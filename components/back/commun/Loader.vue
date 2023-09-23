<template>
    <div class="text-center">
        <v-overlay :model-value="overlay" class="align-center justify-center">
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </div>
</template>
<script lang="ts">
export default {
    props: ['overlayP', 'msg'],

    data: () => ({
        overlay: false,
    }),
    mounted() {
        this.overlay = this.overlayP
    },
}

</script>