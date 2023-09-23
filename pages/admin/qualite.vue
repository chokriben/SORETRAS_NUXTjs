<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Qualite</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[descriptionRule]" required></v-textarea>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="qualites.length" class="centered-container">
      <h2 class="qualites-title green-title">Liste des qualite</h2>
      <ul>
        <li v-for="qualite in qualites" :key="qualite.id" class="qualite-item">
          <div class="qualite-data">
            <h3>{{ qualite.name }}</h3>
            <p>{{ qualite.description }}</p>
          </div>

          <div class="qualite-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editqualite(qualite)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la présentation</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedqualite.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedqualite.description" label="Description" :rules="[descriptionRule]"
                    required></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedqualite">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditqualite">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deletequalite(qualite)">Supprimer</v-btn>
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
      editedqualite: {
        id: null,
        name: '',
        description: '',
      },
      qualites: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchqualites();
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
        await axios.post('https://api.srtk.com.tn/api/admin/qualite/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Présentation créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchqualites();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la présentation!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchqualites(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/qualites', { headers });
        this.qualites = response.data.qualites.data;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des qualite!',
          color: 'error',
        };
      }
    },
    editqualite(qualite) {
      this.editedqualite = {
        id: qualite.id,
        name: qualite.name,
        description: qualite.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedqualite() {
      const payload = {
        name_fr: this.editedqualite.name,
        name_ar: this.editedqualite.name,
        name_en: this.editedqualite.name,
        description_fr: this.editedqualite.description,
        description_ar: this.editedqualite.description,
        description_en: this.editedqualite.description,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/qualite/update/${this.editedqualite.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Présentation modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchqualites();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la présentation!',
          color: 'error',
        };
      }
    },
    cancelEditqualite() {
      this.dialogVisible = false;
    },
    async deletequalite(qualite) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/qualite/${qualite.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Présentation supprimée avec succès!',
            color: 'success',
          };
          this.fetchqualites();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la présentation!',
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

.qualites-title {
  margin-top: 30px;
}

.qualite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.qualite-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
