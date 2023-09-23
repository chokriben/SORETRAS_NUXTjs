<template>
  <v-app id="inspire">

    <Header />
    <NavBarMobile />



    <v-main class="gris-claire">
      <div>
        <v-row class="p-4 ">
          <v-col cols="12" class=" d-flex justify-content-center" sm="4">
            <a :href="localePath('/')" style="width:100%"> <v-img class="bg-white" height="65"
                src="/images/logo-55.png"></v-img>
            </a>

          </v-col>
          <v-col cols="12" class=" d-flex justify-content-center" sm="5">
            <Search />

          </v-col>
          <v-col cols="12" class=" d-flex justify-content-center" sm="3">


            <v-img class="bg-white" height="65" src="/images/tunisie.png"></v-img>

          </v-col>

        </v-row>

      </div>
      <NavBar />
      <Banner />


      <div class="container-ics">
        <v-row>
          <v-col class="pl-7 pr-7 mt-4" cols="12" sm="3">

            <LeftSideBar />

          </v-col>

          <v-col cols="12" sm="6" class="mt-4">


            <v-sheet min-height="70vh" rounded="lg">
              <!-- <NavLinkBread /> -->
              <slot />
            </v-sheet>

          </v-col>

          <v-col class="pl-7 pr-7 mt-4" cols="12" sm="3">



            <RightSideBar />




          </v-col>
        </v-row>
      </div>
      <!-- <Newsletter /> -->
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
export default {
  mounted() {
    this.$vuetify.locale.current = this.$i18n.locale;
  },


}


</script>
<style>
.container-ics {
  width: 95%;
  margin: 0 auto;
}
</style>