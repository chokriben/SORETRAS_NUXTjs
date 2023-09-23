<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Villes</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document" :rules="[villeRule]"
        required></v-textarea>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="villes.length" class="centered-container">
      <h2 class="villes-title green-title">Liste des villes</h2>
      <ul>
        <li v-for="Ville in villes" :key="Ville.id" class="Ville-item">
          <div class="Ville-data">
            <h3>{{ Ville.name }}</h3>
            <p>{{ Ville.description }}</p>
          </div>

          <div class="Ville-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editVille(Ville)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la ville</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedVille.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedVille.description" label="Description" :rules="[villeRule]"
                    required></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedVille">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditVille">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deleteVille(Ville)">Supprimer</v-btn>
          </div>
        </li>
      </ul>
    </div>
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
      formData: {
        name: '',
        description: '',
      },
      dialogVisible: false,
      editedVille: {
        id: null,
        name: '',
        description: '',
      },
      villes: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchVilles();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    async handleSubmit() {
      const formData = new FormData();
      formData.append('name_fr', this.formData.name);
      formData.append('name_ar', this.formData.name);
      formData.append('name_en', this.formData.name);
      formData.append('description_fr', this.formData.description);
      formData.append('description_ar', this.formData.description);
      formData.append('description_en', this.formData.description);

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/ville/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Ville créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchVilles();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Ville!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchVilles(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/villes', { headers });
        this.villes = response.data.Villes.data;

      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des villes!',
          color: 'error',
        };
      }
    },
    editVille(Ville) {
      this.editedVille = {
        id: Ville.id,
        name: Ville.name,
        description: Ville.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedVille() {
      const payload = {
        name_fr: this.editedVille.name,
        name_ar: this.editedVille.name,
        name_en: this.editedVille.name,
        description_fr: this.editedVille.description,
        description_ar: this.editedVille.description,
        description_en: this.editedVille.description,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/ville/update/${this.editedVille.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Ville modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchVilles();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Ville!',
          color: 'error',
        };
      }
    },
    cancelEditVille() {
      this.dialogVisible = false;
    },
    async deleteVille(Ville) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/ville/${Ville.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Ville supprimée avec succès!',
            color: 'success',
          };
          this.fetchVilles();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Ville!',
          color: 'error',
        };
      }
    },
  },
};
</script>

<style scoped>
.centered-title {
  text-align: center;
}

.bigger-title {
  font-size: 24px;
}

.green-title {
  color: green;
}

.villes-title {
  margin-top: 30px;
}

.Ville-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.Ville-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
