<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Categorie</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
            :rules="[descriptionRule]" required></v-textarea>
        </v-col>
        <v-col cols="6" sm="6">
          <v-text-field v-model="formData.klm_debut" prepend-inner-icon="mdi-ruler" label="klm debut"
            placeholder="tapez klm debut" />
        </v-col>
        <v-col cols="6" sm="6">
          <v-text-field v-model="formData.klm_fin" prepend-inner-icon="mdi-ruler" label="klm fin"
            placeholder="tapez klm fin" />
        </v-col>

        <v-col cols="12" sm="6">

          <v-select label="ligne demandé" :items="lignes.map(item => item.name)" v-model="select_line" item-value="id"
            item-text="name">
            <template #no-data>
              Aucun lignes existe
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" sm="6">

          <v-select label="ville demandé" :items="villes.map(item => item.name)" v-model="selects" item-value="id"
            item-text="name">
            <template #no-data>
              Aucun villes existe
            </template>
          </v-select>
        </v-col>

      </v-row>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>
  </div>
</template>



<script>
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';
import Pagination from '~/components/Pagination.vue';
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
definePageMeta({
  layout: "admin",
});
export default {
  components: {
    Pagination
  },
  data() {
    return {
      select_line: null,
      selects: null,
      villes: [], // Array to store the cities
      lignes: [], // Array to store the lines

      formData: {
        name: '',
        description: '',
        klm_debut: '',
        klm_fin: '',
        ville_id: '',
        ligne_id: '',
        select_line: '',
        selects: '',

      },
      lignes: [],
      categories: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  created() {
    this.fetchVilles(); // Fetch cities
    this.fetchLignes(); // Fetch lines

  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    async fetchVilles() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/villes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.villes = response.data.Villes.data;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des villes!',
          color: 'error'
        };
      }
    },
    async fetchLignes() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/lignes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.lignes = response.data.Lignes.data;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des lignes!',
          color: 'error'
        };
      }
    },
    async handleSubmit() {

      const ville = this.villes.find(item => item.name === this.selects);
      if (!ville) {
        // Invalid selected ville
        return;
      }
      const ligne = this.lignes.find(item => item.name === this.select_line);
      if (!ligne) {
        // Invalid selected ligne
        return;
      }
      const formData = new FormData();
      formData.append('name_fr', this.formData.name);
      formData.append('name_ar', this.formData.name);
      formData.append('name_en', this.formData.name);
      formData.append('description_fr', this.formData.description);
      formData.append('description_ar', this.formData.description);
      formData.append('description_en', this.formData.description);
      formData.append('klm_debut', this.formData.klm_debut);
      formData.append('klm_fin', this.formData.klm_fin);
      formData.append('ville_id', ville.id);
      formData.append('ligne_id', ligne.id);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/categorie/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'categorie créée avec succès!',
          color: 'success',
        };
        this.resetForm();

      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la categorie!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
      this.formData.klm_debut = '';
      this.formData.klm_fin = '';
      this.select_line = null; // Clear the selected ligne
      this.selects = null; // Clear the selected ville


    },

  },
};

</script>

<style scoped>
.centered-title {
  text-align: center;
}

.bigger-title {
  font-size: 28px;
}

.green-title {
  color: green;
}

.categories-title {
  margin-top: 30px;
}

.category-list {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  margin-top: 30px;
}

.categorie-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.categorie-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}

@media (max-width: 600px) {
  .categorie-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .categorie-data {
    margin-bottom: 10px;
  }

  .categorie-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>