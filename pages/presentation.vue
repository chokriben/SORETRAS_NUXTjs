<template>
  <br />
  <v-container>
    <v-card class="ics">
      <div class="content" v-html="content"></div>
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
          "https://api.srtk.com.tn/api/page/presentation"
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
      this.$pagename = this.$t("presentation.title"); // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");

      titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
    });
  },
};
</script>

<style scoped>
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
