<template>
  <div>
    <div class="v-row p-12 text-center">
      <div class="v-col-sm-4 v-col-12 ico-ics">
        <span class="mdi mdi-cellphone-sound" style="font-size: 50px"></span>
        <v-card-title class="text-h6 mb-0 pb-0">{{
          $t("contact.phoneNumber")
        }}</v-card-title>
        <p>{{ num_telste }}</p>
      </div>
      <div class="v-col-sm-4 v-col-12 ico-ics">
        <span class="mdi mdi-map-marker-radius" style="font-size: 50px"></span>
        <v-card-title class="text-h6 mb-0 pb-0">{{
          $t("contact.adresse")
        }}</v-card-title>
        <p>{{ adr_ste }}</p>
      </div>
      <div class="v-col-sm-4 v-col-12 ico-ics">
        <span class="mdi mdi-email-outline" style="font-size: 50px"></span>
        <v-card-title class="text-h6 mb-0 pb-0">{{
          $t("contact.email")
        }}</v-card-title>
        <p>{{ mailste }}</p>
      </div>
    </div>
  </div>
  <div class="box">
    <v-row class="p-12">
      <div class="v-col-sm-6 v-col-12">
        <v-card-title class="text-h6 mb-0 pb-0"></v-card-title>
        <v-card-title class="text-h4 mt-0 pt-0 mb-5"></v-card-title>
        <v-img class="bg" src="/images/cam/18.jpg"></v-img>
      </div>

      <div class="v-col-sm-6 v-col-12 elevation-3 frm">
        <form class="pt-6" @submit.prevent="handleSubmit">
          <VSnackbar v-model="snackbar.show" :color="snackbar.color" :position="snackbar.position">
            {{ snackbar.message }}
          </VSnackbar>
          <v-text-field v-model="name" prepend-inner-icon="mdi-account" :label="$t('contact.nam')" variant="underlined"
            color="primary"></v-text-field>
          <v-text-field v-model="num_telephone" prepend-inner-icon="mdi-phone" :label="$t('contact.phoneNumber')"
            variant="underlined" color="primary"></v-text-field>
          <VCol cols="6">
            <VTextField v-model="email" prepend-inner-icon="mdi-email-outline" variant="underlined" color="primary"
              :label="$t('contact.email')" type="email" placeholder="Email" />
          </VCol>
          <v-textarea v-model="message" prepend-inner-icon="mdi-message" :label="$t('contact.message')"
            variant="underlined" color="primary"></v-textarea>
          <v-checkbox v-model="acceptTerms" :label="$t('contact.acceptTerms')" type="checkbox"></v-checkbox>
          <v-btn class="me-4" type="submit" :disabled="!isSubmitButtonClickable">{{ $t("contact.sendButton") }}</v-btn>
          <v-btn @click="resetForm">{{ $t("contact.clearButton") }}</v-btn>
        </form>
      </div>
    </v-row>
  </div>

  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13044.656334920188!2d8.866875312841794!3d35.1774627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f93e3d4f28220f%3A0x52b97df6d7466a54!2sSTE%20REGIONALE%20DE%20TRANSPORT%20DE%20KASSERINE!5e0!3m2!1sar!2stn!4v1688645219806!5m2!1sar!2stn"
    width="100%" height="350" style="border: 0" allowfullscreen="" loading="lazy">
  </iframe>
</template>
<script>
import axios from "axios";
definePageMeta({
  layout: "p",
});

export default {
  name: "ContactPage",
  data() {
    return {
      mailste: "",
      num_telste: "",
      nameste: "",
      adr_ste: "",
      email: "",
      num_telephone: "",
      name: "",
      message: "",
      acceptTerms: false,
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      snackbar: {
        show: false,
        message: "",
        color: "",
      },
    };
  },
  computed: {
    isSubmitButtonClickable() {
      return this.acceptTerms;
    },
  },
  methods: {
    resetForm() {
      this.email = "";
      this.num_telephone = "";
      this.name = "";
      this.message = "";
    },
    async handleSubmit(event) {
      event.preventDefault();
      if (!this.emailRegex.test(this.email)) {
        this.snackbar = {
          show: true,
          message: "Email is not valid!",
          color: "error",
          position: "top",
        };

        this.resetForm();
        return;
      }

      const payload = {
        email: this.email,
        name: this.name,
        num_telephone: this.num_telephone,
        message: this.message,
      };

      try {
        await axios.post("https://api.srtk.com.tn/api/contact/add", payload);

        this.acceptTerms = false;
        this.resetForm();
        this.snackbar = {
          show: true,
          message: "Registration successful!",
          color: "success",
        };
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: "Registration failed!",
          color: "error",
        };
      }
    },
    async fetchData() {
      try {
        const response = await axios.get(
          "https://api.srtk.com.tn/api/settingsclient"
        );
        const { success, message, setting } = response.data;

        if (success) {
          const translation = setting.translations.find(
            (t) => t.locale === this.$i18n.locale
          );

          if (translation) {
            this.num_telste = setting.num_tel_s;
            this.mailste = setting.email;

            this.nameste = translation.raison_sociale;
            this.adr_ste = translation.adresse;
          } else {
            console.error("Translation not found for the selected locale");
          }
        } else {
          console.error(message);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchData();
    this.$nextTick(() => {
      this.$pagename = this.$t("contact.title"); // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");

      titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
    });
  },
};
</script>

<style>
.ico-ics {
  color: #333;
}

.ico-ics:hover {
  background: linear-gradient(to right, #0053a0, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
}

.box {
  background-color: #faf7f0;
}

.frm {
  z-index: 8;
  padding-right: 25px;
  padding-left: 25px;
  padding-bottom: 25px;
  border-radius: 10px;
  background-color: #fff;
}

.bg {
  border-radius: 5px;
}

@media only screen and (min-width: 600px) {
  .frm {
    margin-top: 160px;
    margin-left: -50px;
  }
}
</style>
