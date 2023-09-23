<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Secruite</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[descriptionRule]" required></v-textarea>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="secruites.length" class="centered-container">
      <h2 class="secruites-title green-title">Liste des Secruites</h2>
      <div class="secruites-container">
        <ul>
          <li v-for="secruite in secruites" :key="secruite.id" class="secruite-item">
            <div class="secruite-data">
              <h3>{{ secruite.name }}</h3>
              <p>{{ secruite.description }}</p>
            </div>

            <div class="secruite-actions">
              <v-dialog v-model="dialogVisible" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" v-on="on" @click="editsecruite(secruite)">Modifier</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Modifier la Secruite</span>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field v-model="editedsecruite.name" label="Nom" required></v-text-field>
                    <v-textarea v-model="editedsecruite.description" label="Description" :rules="[descriptionRule]"
                      required></v-textarea>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn color="primary" @click="saveEditedsecruite">Enregistrer</v-btn>
                    <v-btn color="error" @click="cancelEditsecruite">Annuler</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-btn color="error" @click="deletesecruite(secruite)">Supprimer</v-btn>
            </div>
          </li>
        </ul>
      </div>
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
      editedsecruite: {
        id: null,
        name: '',
        description: '',
      },
      secruites: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  created() {
    this.fetchsecruites();
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
        await axios.post('https://api.srtk.com.tn/api/admin/secruite/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Secruite créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchsecruites();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Secruite!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchsecruites(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/secruites', { headers });
        this.secruites = response.data.Securites.data;
        //console.log(this.secruites)
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des Secruites!',
          color: 'error',
        };
      }
    },
    editsecruite(secruite) {
      this.editedsecruite = {
        id: secruite.id,
        name: secruite.name,
        description: secruite.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedsecruite() {
      const payload = {
        name_fr: this.editedsecruite.name,
        name_ar: this.editedsecruite.name,
        name_en: this.editedsecruite.name,
        description_fr: this.editedsecruite.description,
        description_ar: this.editedsecruite.description,
        description_en: this.editedsecruite.description,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/secruite/update/${this.editedsecruite.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Secruite modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchsecruites();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Secruite!',
          color: 'error',
        };
      }
    },
    cancelEditsecruite() {
      this.dialogVisible = false;
    },
    async deletesecruite(secruite) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/secruite/${secruite.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Secruite supprimée avec succès!',
            color: 'success',
          };
          this.fetchsecruites();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Secruite!',
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

.secruites-title {
  margin-top: 30px;
}

.secruites-container {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 5px;
}

.secruite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.secruite-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}

@media (max-width: 600px) {
  .bigger-title {
    font-size: 20px;
  }

  .secruites-title {
    margin-top: 20px;
  }
}
</style>
