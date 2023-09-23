<template >
  <v-app id="inspire" style="font-size:14px">

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


      <v-row>
        <Slider />
      </v-row>
      <div class="container-ics">
        <v-row>
          <v-col class="pl-7 pr-7 mt-4" cols="12" sm="3">

            <LeftSideBar />

          </v-col>

          <v-col cols="12" sm="6" class="">


            <v-sheet min-height="70vh" rounded="lg">
              <!-- <NavLinkBread /> -->
              <slot />


            </v-sheet>
          </v-col>

          <v-col class="pl-7 pr-7 mt-4 " cols="12" sm="3">



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
  data: () => ({
    links: [
      'Home',
      'About Us',
      'Team',
      'Services',
      'Blog',
      'Contact Us',
    ],
  })
}
function onClick(e) {
  e.preventDefault();
  grecaptcha.enterprise.ready(async () => {
    const token = await grecaptcha.enterprise.execute('6LeW3fsnAAAAANh5sajhGud7KBsrWTtE054balUB', { action: 'LOGIN' });
    // IMPORTANT: The 'token' that results from execute is an encrypted response sent by
    // reCAPTCHA Enterprise to the end user's browser.
    // This token must be validated by creating an assessment.
    // See https://cloud.google.com/recaptcha-enterprise/docs/create-assessment
  });
}

</script>

<style>
.container-ics {
  width: 95%;
  margin: 0 auto;
}
</style>