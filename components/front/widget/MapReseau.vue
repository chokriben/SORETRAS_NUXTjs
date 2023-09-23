<template>
    <v-card class="mx-auto mt-2 mb-3" title="Carte" subtitle="Notre Réseau" max-height="490">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26091.62360220052!2d8.807258337538489!3d35.170261590242234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f93e03277f3b3d%3A0x9165782c2e6df471!2sKasserine!5e0!3m2!1sfr!2stn!4v1678114553228!5m2!1sfr!2stn"
            width="100%" height="295" style="border:0;" allowfullscreen="false" loading="lazy"></iframe>

        <v-card-title>
            100 Station
        </v-card-title>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="#0383ff">
                Explorer
            </v-btn>



        </v-card-actions>

    </v-card>
</template>
<script>
export default {
    data: () => ({
        show: false,
    }),
}
</script>