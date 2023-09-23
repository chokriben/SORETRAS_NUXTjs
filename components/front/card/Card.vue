<template>
  <v-row class="mt-0 pt-0" max-width="500">

    <v-col class="col-md-6 col-sm-12">
      <v-hover v-slot="{ isHovering, props }" close-delay="50">
        <v-card :elevation="isHovering ? 16 : 2" :class="{ 'on-hover': isHovering }" class="mx-auto" height="410"
          max-width="350" v-bind="props">
          <v-img class="align-end text-black" height="200" src="/images/cam/18.jpg" cover>
            <v-card-title style=" background: linear-gradient(to top, #0053a0, #1414ff) ;color:white">
              {{ $t('home.abn_reg') }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4" max-width="500">
            Scolaire / Ordinare
          </v-card-subtitle>

          <v-card-text>

            Sbiba, Thala, Alayoun, Hidra, Foussana, Sbitla, Mejel bel abbes, Hassi ferid, Feriana, Jedliane ,
            Kasserine
          </v-card-text>

          <v-card-actions class="mb-2 justify-center">
            <router-link to="/regional">
              <v-btn class="elevation-3" color="#3081cd">
                {{ $t('menu.voir_plus') }}
              </v-btn>
            </router-link>

          </v-card-actions>
        </v-card>
      </v-hover>
    </v-col>
    <v-col class="col-md-6 col-sm-12">
      <v-hover v-slot="{ isHovering, props }" close-delay="50">
        <v-card :elevation="isHovering ? 16 : 2" :class="{ 'on-hover': isHovering }" class="mx-auto" height="410"
          max-width="350" v-bind="props">
          <v-img class="align-end text-black" height="200" src="/images/cam/8.jpg" cover>
            <v-card-title style="background: linear-gradient(to top, #0053a0, #1414ff) ;color:white">
              {{ $t('home.abn_urb') }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pt-4" max-width="500">
            Scolaire / Ordinare
          </v-card-subtitle>

          <v-card-text>

            <div>El Arich,
              ,Ennour
              ,Essalem
              ,Ezzouhour
              ,El Bassatine
              ,El Fath
              ,El Karma
              ,El Khadhra
              ,El Manar
              ,Cité Olympique
            </div>
          </v-card-text>

          <v-card-actions class="mb-2 justify-center">
            <router-link to="/urbain">
              <v-btn class="elevation-3" color="#3081cd">
                {{ $t('menu.voir_plus') }}
              </v-btn>
            </router-link>


          </v-card-actions>
        </v-card>
      </v-hover>

    </v-col>
  </v-row>
</template>

<script>
export default {

}
</script>

<style lang="sass" >

.v-card.on-hover.v-theme--dark
  background-color: rgba(#FFF, 0.8)
  .v-card__text
    color: #000
   
</style>