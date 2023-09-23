<template>
  <div>
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}

    </VSnackbar>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>

        <v-card-text class="dialog-header">
          <span class="dialog-title">Update Catecor</span>
        </v-card-text>
        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedCategorie.name" label="Name" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedCategorie.description" label="description" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedCategorie.klm_debut" label="klm_debut" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedCategorie.klm_fin" label="klm_fin" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedCategorie.ville_id" label="ville" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedCategorie.ligne_id" label="ligne" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateCategorieDetails">Update</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher categorie"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchCategories"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn size="large" color="secondary" @click="navigateToPage" class="add-categories-btn">
            Ajouter
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="480" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">Nom</th>
          <th class="text-uppercase">description</th>
          <th class="text-uppercase">Ville</th>
          <th class="text-uppercase">ligne</th>
          <th class="text-uppercase">Klm debut</th>
          <th class="text-uppercase">Klm Fin</th>
          <th class="text-uppercase">Action</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedCategories" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ getVilleName(item.ville_id) }}</td>
          <td>{{ getLigneName(item.ligne_id) }}</td>
          <td>{{ item.klm_debut }}</td>
          <td>{{ item.klm_debut }}</td>



          <td class="text-center">
            <v-btn variant="text" color="green" fab small @click="editCategorie(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn variant="text" color="green" fab small @click="deleteCategorie(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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
      villes: [], // Initialize the villes array
      lignes: [],
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 7,
      totalItems: 0,
      categories: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedcategorie: null,
      editDialog: false,
      editedCategorie: {
        id: null,
        name: '',


      },
    };
  },
  async created() {
    // Fetch villes and lignes data from the API before rendering the component
    await this.fetchVilles();
    await this.fetchLignes();
    this.async();
    this.editDialog = false;
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    async fetchVilles() {
      // Fetch villes data from the API and populate the villes array
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get('https://api.srtk.com.tn/api/admin/villes', { headers });

        this.villes = response.data.Villes.data;

      } catch (error) {
        console.error(error);
      }
    },

    async fetchLignes() {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/lignes', { headers });
        this.Lignes = response.data.Lignes.data; // Assuming the API response is an array of ligne objects

      } catch (error) {
        console.error(error);
      }
    },
    async async(search = false) {
      const axios = useNuxtApp().$axios;

      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      let url = `/admin/categories?page=${this.currentPage}`;

      if (search) {
        url += `&search=${this.searchTerm}`; // Append the search term to the URL
      }
      axios
        .get(`/admin/categories?page=${this.currentPage}&search=${this.searchTerm}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((res) => {
          this.totalItems = res.data.Categories.total;
          this.categories = res.data.Categories.data.data;

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
    navigateToPage(categorie) {
      this.selectedcategorie = categorie;
      this.$router.push({ path: '/admin/categorie', query: { id: categorie.id } });
    },
    searchCategories() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true); // Pass true to indicate a search request
      } else {
        this.clearSearch(); // Call the clearSearch method
      }
    },
    editCategorie(categorie) {
      this.editedCategorie = {
        id: categorie.id,
        name: categorie.name,
        description: categorie.description,
        klm_debut: categorie.klm_debut,
        klm_fin: categorie.klm_fin,
        ligne_id: categorie.ligne_id,
        ville_id: categorie.ville_id,


      };

      this.editDialog = true;
    },
    async updateCategorieDetails() {
      const payload = {
        name_fr: this.editedCategorie.name, // Fixed: Use editedCategorie instead of editCategorie
        name_ar: this.editedCategorie.name, // Fixed: Use editedCategorie instead of editCategorie
        name_en: this.editedCategorie.name, // Fixed: Use editedCategorie instead of editCategorie
        description_fr: this.editedCategorie.description,
        description_ar: this.editedCategorie.description,
        description_en: this.editedCategorie.description,
        klm_debut: this.editedCategorie.klm_debut,
        klm_fin: this.editedCategorie.klm_fin,
        ville_id: this.editedCategorie.ville_id,
        ligne_id: this.editedCategorie.ligne_id,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/categorie/update/${this.editedCategorie.id}`,
          payload,
          { headers }
        );
        const index = this.Categories.findIndex((item) => item.id === this.editedCategorie.id);
        if (index !== -1) {
          this.Categories[index] = { ...this.editedCategorie };
        }
        this.snackbar = {
          show: true,
          message: 'categorie modifiée avec succès!',
          color: 'success',
        };
        this.editDialog = false;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la categorie!',
          color: 'error',
        };
      }
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    async deleteCategorie(categorie) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/categorie/${categorie.id}`, { headers });
          // Remove the deleted item from the array
          const index = this.categories.findIndex((item) => item.id === categorie.id);
          if (index !== -1) {
            this.categories.splice(index, 1);
          }
          this.snackbar = {
            show: true,
            message: 'categorie supprimée avec succès!',
            color: 'success',
          };
          this.snackbar = {
            show: true,
            message: 'categorie  supprimée avec succès!',
            color: 'success',
          };

        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la categorie!',
          color: 'error',
        };
      }
    },


    getVilleName(villeId) {
      const ville = this.villes.find(v => v.id === villeId);
      return ville ? ville.name : 'Unknown Ville';
    },

    getLigneName(ligneId) {
      const ligne = this.lignes.find(l => l.id === ligneId);
      return ligne ? ligne.name : 'Unknown Ligne';
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedCategories() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const filteredCategories = this.categories.filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filteredCategories.slice(startIndex, endIndex);
    },
  },
};
</script>

<style>
.dialog-header {
  background-color: #eee;
  padding: 16px;
}

.bold-header {
  font-weight: bold;
  color: #a13214;
  /* Use any gray color code or name you prefer */
}

.dialog-title {
  font-size: 30px;
  color: #05831c;
  position: -ms-page;
}

.add-categories-btn {
  width: 900px;
  /* Adjust the width to your desired value */
}
</style>