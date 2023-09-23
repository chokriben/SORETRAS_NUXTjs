<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Gouvernorat</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[descriptionRule]" required></v-textarea>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="gouvernorats.length" class="centered-container">
      <h2 class="gouvernorats-title green-title">Liste des gouvernorats</h2>
      <ul>
        <li v-for="gouvernorat in gouvernorats" :key="gouvernorat.id" class="gouvernorat-item">
          <div class="gouvernorat-data">
            <h3>{{ gouvernorat.name }}</h3>
            <p>{{ gouvernorat.description }}</p>
          </div>

          <div class="gouvernorat-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editgouvernorat(gouvernorat)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la gouvernorat</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedgouvernorat.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedgouvernorat.description" label="Description" :rules="[descriptionRule]"
                    required></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedgouvernorat">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditgouvernorat">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deletegouvernorat(gouvernorat)">Supprimer</v-btn>
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
      editedgouvernorat: {
        id: null,
        name: '',
        description: '',
      },
      gouvernorats: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchgouvernorats();
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
      formData.append('ville_id', 2);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/gouvernorat/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'gouvernorat créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchgouvernorats();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la gouvernorat!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchgouvernorats(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/gouvernorats', { headers });
        this.gouvernorats = response.data;
        //console.log(this.gouvernorats)
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des gouvernorats!',
          color: 'error',
        };
      }
    },
    editgouvernorat(gouvernorat) {
      this.editedgouvernorat = {
        id: gouvernorat.id,
        name: gouvernorat.name,
        description: gouvernorat.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedgouvernorat() {
      const payload = {
        name_fr: this.editedgouvernorat.name,
        name_ar: this.editedgouvernorat.name,
        name_en: this.editedgouvernorat.name,
        description_fr: this.editedgouvernorat.description,
        description_ar: this.editedgouvernorat.description,
        description_en: this.editedgouvernorat.description,
        ville_id: 2,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/gouvernorat/update/${this.editedgouvernorat.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'gouvernorat modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchgouvernorats();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la gouvernorat!',
          color: 'error',
        };
      }
    },
    cancelEditgouvernorat() {
      this.dialogVisible = false;
    },
    async deletegouvernorat(gouvernorat) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/gouvernorat/${gouvernorat.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'gouvernorat supprimée avec succès!',
            color: 'success',
          };
          this.fetchgouvernorats();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la gouvernorat!',
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

.gouvernorats-title {
  margin-top: 30px;
}

.gouvernorat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.gouvernorat-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
