<template>
  <div>
    <v-card :title="$t('widget.evenements')" subtitle="2023">
      <v-timeline side="end" align="start">
        <v-timeline-item v-for="(evenement, index) in evenements" :key="evenement.id"
          :dot-color="index === 0 ? 'logo' : undefined" size="small">
          <div class="d-flex">
            <strong class="me-4">{{ formatDate(evenement.date_debut) }}</strong>
            <div>
              <strong>{{ evenement.name }}</strong>
              <div class="text-caption">
                {{ evenement.description }}
              </div>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>

      <v-card-actions>
        <v-spacer></v-spacer>
        <router-link to="/evenement">
          <v-btn variant="outlined" color="#0383ff">{{ $t('menu.voir_plus') }}</v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  data() {
    return {
      evenements: [],
      snackbar: {
        show: false,
        message: '',
        color: ''
      }
    };
  },

  created() {
    this.fetchEvenements();
  },

  methods: {
    formatDate(date) {
      const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },

    async fetchEvenements() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/evenement');
        const evenements = response.data.Evenements;

        evenements.forEach(item => {
          const translation = item.translations.find(s => s.locale === this.$i18n.locale);

          if (translation) {
            item.name = translation.name;
            item.description = translation.description;
          }
        });

        this.evenements = evenements;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des événements!',
          color: 'error'
        };
      }
    }
  }
};
</script>