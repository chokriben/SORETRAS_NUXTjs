<template>
    <v-sheet rounded="lg" min-height="268">
        <Horaire />
    </v-sheet>

    <Reservation />

    <v-sheet rounded="lg" min-height="215" class="mt-4">
        <Horaire2 />
    </v-sheet>
    <v-card title="AGENDA" subtitle="" min-height="255" class="mt-2">

        <DatePicker v-model="date" is-expanded />


    </v-card>
</template>

<script>
import { DatePicker } from 'v-calendar-ssr-mod';

export default {
    components: {
        DatePicker,
    },
    setup() {
        return {
            date: new Date(),
        };
    },
}


</script>

<style lang="scss" scoped></style>