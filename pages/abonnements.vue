<template>
  <v-row class="mt-0 pt-0" max-width="500">

    <v-col class="col-md-6 col-sm-12">
      <v-hover v-slot="{ isHovering, props }" close-delay="50">
        <v-card :elevation="isHovering ? 16 : 2" :class="{ 'on-hover': isHovering }" class="mx-auto" height="410"
          max-width="350" v-bind="props">
          <v-img class="align-end text-black" height="200" src="/images/cam/18.jpg" cover>
            <v-card-title style="background: linear-gradient(to top, #0053a0, #1414ff) ;color:white">Abonnement
              régional</v-card-title>
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
                Voir plus
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
            <v-card-title style="background: linear-gradient(to top, #0053a0, #1414ff) ;color:white">Abonnement
              urbain</v-card-title>
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
                Voir plus
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
  data: () => ({
    enabled: false,
    typabon: null,
    typetud: null,
    typeetudfac: null,
    cin: '',
    password: '',
    cinRule: [
      v => /^[0-9]+$/.test(v) || 'Le champ doit contenir uniquement des caractères numériques.'
    ],
    select: { name: 'كلية الطب بصفاقس', id: '1' },
    items: [
      { name: 'كلية الطب بصفاقس', id: '1' },
      { name: 'كلية العلوم الإقتصادية والتصرف بصفاقس', id: '2' },
      { name: 'كلية العلوم بصفاقس', id: '3' },

    ],

  }),
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    cinErrors() {
      const errors = [];
      if (!/^[0-9]+$/.test(this.cin) && this.cin != '') {
        errors.push('Le champ doit contenir uniquement des caractères numériques.');
      }
      return errors;
    }
  },
  methods: {
    toggleVisibility() {
      const vCar = document.getElementById("v-card");
      if (vCar) {
        vCar.style.display = this.enabled ? "block" : "none";
      }
    },

    eleveform() {
      // Handle form submission logic here
      // You can access the values of the fields using this.numCarte, this.jourNaissance, this.moisNaissance, and this.anneeNaissance
      //console.log('CIN:', this.cin);
      //console.log('Mot de passe:', this.password);
      // Exemple de validation basique
      if (this.cin && this.password) {
        // Continuer avec le traitement du formulaire
      }
    },
    etudiant_form() {
      //console.log('CIN:', this.cin);

    }
  },
};
</script>

<style>
td {
  padding: 0 10px !important;
}

.login {
  color: white;
}

.v-label {
  font-size: 14px;
}
</style>
