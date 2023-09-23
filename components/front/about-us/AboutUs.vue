<template>
    <v-row>

        <v-col cols="12" sm="6">
            <CardAbout />
        </v-col>
        <v-col cols="12" sm="6">
            <CardAbout2 />
        </v-col>
    </v-row>
</template>
<style lang="sass" scoped>
.v-card.on-hover.v-theme--dark
  background-color: rgba(#FFF, 0.8)
  >.v-card__text
    color: #000
</style>