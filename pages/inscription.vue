<template>
  <v-container style="width:50%">
    <v-card title="Espace Parent" subtitle="Inscription">
      <v-form @submit.prevent="eleveform" class="m-3">
        <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="numCin" :rules="[cinRule]"
          :error-messages="cinErrors" color="primary" label="Numéro CIN" variant="underlined"></v-text-field>
        <v-select prepend-inner-icon="mdi-calendar-range" v-model="anneeNaissance" :items="getAnnees()" color="primary"
          label="Année de Naissance" variant="underlined"></v-select>


        <v-select prepend-inner-icon="mdi-calendar-range" v-model="moisNaissance" :items="getMois()" color="primary"
          label="Mois de Naissance" variant="underlined"></v-select>
        <v-select prepend-inner-icon="mdi-calendar-range" v-model="jourNaissance" :items="getJours()" color="primary"
          label="Jour de Naissance" variant="underlined"></v-select>


        <v-btn type="submit" color="#1414ff" class="font-weight-medium ml-auto m-3 login text-body-2 next">
          Suivant
        </v-btn>
        <div style="color:red"> {{ prob }}</div>

      </v-form>
    </v-card>
  </v-container>
</template>
  
<script>
definePageMeta({
  layout: "p",
});
export default {
  data() {
    return {
      numCin: '',
      jourNaissance: null,
      moisNaissance: null,
      anneeNaissance: null,
      prob: '',
      cinRule: [
        v => /^[0-9]+$/.test(v) || 'Le champ doit contenir uniquement des caractères numériques.'
      ]
    };
  },
  computed: {
    cinErrors() {
      const errors = [];
      if (!/^[0-9]+$/.test(this.numCin) && this.numCin != '') {
        errors.push('Le champ doit contenir uniquement des caractères numériques.');
      }
      return errors;
    }
  },
  methods: {
    async eleveform() {
      var formdata = new FormData();
      formdata.append("numCin", this.numCin);
      formdata.append("jourNaiss", this.jourNaissance);
      formdata.append("moisNaiss", this.moisNaissance);
      formdata.append("anneeNaiss", this.anneeNaissance);
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      try {
        const response = await fetch("https://api.srtk.com.tn/checkcitoyen.php", requestOptions);
        const result = await response.json();

        if (result.codeR === '1') {
          // Rediriger vers /inscription1
          this.$router.push(`/inscription1?cin=${this.numCin}&jr=${this.jourNaissance}&mm=${this.moisNaissance}&an=${this.anneeNaissance}`);

        } else {
          // Rester sur la même page (peut-être afficher un message d'erreur)
          this.prob = 'Aucun citoyen trouvé correspondant aux données saisies';
          //console.log("Aucun citoyen trouvé");
        }
      } catch (error) {
        // console.error('Erreur lors de l\'appel de l\'API :', error);
        // Gérer les erreurs de l'appel à l'API ici
      }
    },


    getJours() {
      if (this.moisNaissance && this.anneeNaissance) {
        const joursDansMois = new Date(
          this.anneeNaissance,
          this.moisNaissance,
          0
        ).getDate();
        return Array.from({ length: joursDansMois }, (_, i) => String(i + 1));
      }
      return [];
    },
    getMois() {
      return Array.from({ length: 12 }, (_, i) => String(i + 1));
    },
    getAnnees() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 100 }, (_, i) => String(currentYear - i));
    }
  }
};
</script>
  
<style>
.next {
  color: white;
  border-radius: 5px;
}
</style>
  