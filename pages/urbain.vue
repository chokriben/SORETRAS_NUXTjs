<template>
  <v-container class="cont">
    <v-card style="padding: 40px">
      <div class="content" v-html="content"></div>
      <div class="d-flex justify-space-around btn">
        <router-link to="/abonnement">
          <v-btn class="bt-ics">S'inscrire</v-btn>
        </router-link>
        <router-link to="/renouvellement">
          <v-btn class="bt-ics">renouvellement </v-btn>
        </router-link>
        <router-link to="/changement">
          <v-btn class="bt-ics">changements </v-btn>
        </router-link>
        <router-link to="/recevoir">
          <v-btn class="bt-ics"> recevoir </v-btn>
        </router-link>
        <router-link to="/imprimer">
          <v-btn class="bt-ics"> Imprimer </v-btn>
        </router-link>
        <router-link to="/recuperer">
          <v-btn class="bt-ics"> Recuperer code abonnement </v-btn>
        </router-link>
      </div>
      <br />
    </v-card>
  </v-container>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import useAxios from "~/hooks/useAxios";
import axios from "axios";
definePageMeta({
  layout: "p",
});
export default {
  data() {
    return {
      name: "",
      content: "",
    };
  },
  methods: {
    renderHtml(content) {
      return { __html: content };
    },
    async fetchData() {
      try {
        const response = await axios.get(
          "https://api.srtk.com.tn/api/page/urb_scol"
        );
        const { success, message, Securite } = response.data;

        if (success) {
          const translation = Securite.translations.find(
            (t) => t.locale === this.$i18n.locale
          );

          if (translation) {
            this.name = translation.name;
            this.content = translation.description;
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
      this.$pagename = this.$t("acces_info.title"); // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");

      titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
    });
  },
};
</script>
<style>
p .color {
  color: rgb(54 145 214);
}

.colorred {
  color: red;
}

div .btn button {
  font-size: 19px;
}

.title {
  font-size: 20px;
  color: rgb(54 145 214);
}

v-text {
  display: block;
}

.sub {
  color: red;
  font-size: 18px;
}

.tit-center {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: red;
}

.tit-center-light {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: red;
  line-height: 30px;
}

.bt-ics {
  font-size: 14px !important;
  text-transform: capitalize;
  background: linear-gradient(to top, #0053a0, #3182ce) !important;
  color: white;
}

.bt-ics:hover {
  background: linear-gradient(to bottom, #0053a0, #4aa2f5) !important;
  color: white;
}

.mdi-check {
  font-size: 17px;
  color: #4287ff;
}

thead tr {
  font-size: 15px;
  background-color: #5cabfa33;
}

tbody tr {
  font-size: 14px;
}

.highlight-row {
  font-size: 14px;
  background-color: #5cabfaa4;
  transition: background-color 0.3s ease-in-out;
}

.highlight-row:hover {
  background-color: #4287ff;
  color: white;
}

.custom-table {
  border: 1px solid #ccc;
}

.custom-table {
  border: 1px solid #ccc;
}

.ics {
  text-align: justify;
}

.ics:hover {
  box-shadow: 0px 0px 10px 1px;
}

.v-card {
  padding: 10px;
}
</style>
