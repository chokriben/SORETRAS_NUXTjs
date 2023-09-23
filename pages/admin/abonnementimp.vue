<template>
  <div>
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}

    </VSnackbar>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>

        <v-card-text class="dialog-header">
          <span class="dialog-title">Update Ligne</span>
        </v-card-text>
        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedLigne.name" label="Name" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedLigne.code" label="Code" required></v-text-field>
              </v-col>
              <v-col cols="12">

                <select v-model="selectedGareId" class="forms" autocomplete>
                  <option value="null">Sélectionnez une gare</option>
                  <option v-for="gare in garess" :value="gare.id">{{ gare.name }}</option>
                </select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateLigneDetails">Modifier</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher Ligne"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchLignes"></v-text-field>
        </v-col>

      </v-row>
    </v-card>

    <v-table height="690" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">Nom</th>
          <th class="text-uppercase">etat</th>
          <th class="text-uppercase">date</th>

          <th class="text-uppercase">Action</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedLignes" :key="item.id">
          <td>{{ item.nb }}</td>
          <td>{{ item.etat }}</td>

          <td>{{ item.date_imprim }}</td>

          <td class="text-center">
            <a v-if="item.etat === 'Imprimer' || item.etat === 'Imprimer ch'"
              :href="`https://api.srtk.com.tn/api/admin/envoie?date=${item.date_imprim}`" target="blank"> <v-btn
                variant="text" color="green" fab small @click="editLigne(item)">
                Envoyer
              </v-btn></a>

          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="text-center">
      <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" @input="async"
        prev-icon="mdi-chevron-left" next-icon="mdi-chevron-right" color="red"></v-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
definePageMeta({
  layout: "admin",
});
export default {
  data() {
    return {
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 12,
      totalItems: 0,
      Lignes: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedLigne: null,
      editDialog: false,
      garess: [],
      selectedGareId: null,
      editedLigne: {
        id: null,
        name: '',
        code: ''

      },
    };
  },
  created() {
    this.async();
    this.editDialog = false;

  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  mounted() {
    // Fetch gares
    this.fetchgares();
  },
  methods: {
    async async(search = false) {
      const axios = useNuxtApp().$axios;

      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      let url = `/send_sms`;

      if (search) {
        url += `&search=${this.searchTerm}`; // Append the search term to the URL
      }
      axios
        .get(`/send_sms`)
        .then((res) => {
          this.totalItems = res.data.Abonne;
          this.Lignes = res.data.Abonne;
          this.isReady = true;
          this.editDialog = false;
        })
        .catch((err) => {
          this.isReady = true;
          this.editDialog = false;
        });
    },
    clearSearch() {
      this.searchTerm = ''; // Clear the search term
      this.async(); // Fetch the initial data
    },
    navigateToPage(ligne) {
      this.selectedLigne = ligne;
      this.$router.push({ path: '/admin/ligne', query: { id: ligne.id } });
    },
    searchLignes() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true); // Pass true to indicate a search request
      } else {
        this.clearSearch(); // Call the clearSearch method
      }
    },
    editLigne(ligne) {
      this.editedLigne = {
        id: ligne.id,
        name: ligne.name,
        code: ligne.cod,

      };

      this.editDialog = true;
    },
    async updateLigneDetails() {
      const payload = {
        name_fr: this.editedLigne.name, // Fixed: Use editedLigne instead of editLigne
        name_ar: this.editedLigne.name, // Fixed: Use editedLigne instead of editLigne
        name_en: this.editedLigne.name, // Fixed: Use editedLigne instead of editLigne
        code: this.editedLigne.code,
        gare: this.selectedGareId,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/ligne/update/${this.editedLigne.id}`,
          payload,
          { headers }
        );
        const index = this.Lignes.findIndex((item) => item.id === this.editedLigne.id);
        if (index !== -1) {
          this.Lignes[index] = { ...this.editedLigne };
        }
        this.snackbar = {
          show: true,
          message: 'ligne modifiée avec succès!',
          color: 'success',
        };
        this.editDialog = false;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la ligne!',
          color: 'error',
        };
      }
    },
    async fetchgares() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/gares');
        // Assign the retrieved data to the formData property
        this.garess = response.data.Gares.data;
        //console.log("gare : ", this.garess);
      } catch (error) {
        console.error('Error fetching gares:', error);
      }
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    async deleteLigne(ligne) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/ligne/${ligne.id}`, { headers });
          // Remove the deleted item from the array
          const index = this.Lignes.findIndex((item) => item.id === ligne.id);
          if (index !== -1) {
            this.Lignes.splice(index, 1);
          }
          this.snackbar = {
            show: true,
            message: 'Ligne  supprimée avec succès!',
            color: 'success',
          };

        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Ligne!',
          color: 'error',
        };
      }
    },



  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedLignes() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const filteredLignes = this.Lignes;
      return filteredLignes.slice(startIndex, endIndex);
    },
  },
};
</script>

<style>
.dialog-header {
  background-color: #eee;
  padding: 16px;
}

.dialog-title {
  font-size: 30px;
  color: #05831c;
  position: -ms-page;
}
</style>