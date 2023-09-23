<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Photos</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[descriptionRule]" required></v-textarea>


      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div class="centered-container">
      <h2 class="galleries-title green-title">Liste des galleries</h2>
      <div class="galleries-container">
        <ul>
          <li v-for="gallerie in galleries" :key="gallerie.id" class="gallerie-item">
            <div class="gallerie-data">
              <h3>{{ gallerie.name }}</h3>
              <p>{{ gallerie.description }}</p>
            </div>

            <div class="gallerie-actions">
              <v-dialog v-model="dialogVisible" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" v-on="on" @click="editgallerie(gallerie)">Modifier</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Modifier la Photos</span>
                  </v-card-title>
                  <v-card-text>
                    <v-text-field v-model="editedgallerie.name" label="Nom" required></v-text-field>
                    <v-textarea v-model="editedgallerie.description" label="Description" :rules="[descriptionRule]"
                      required></v-textarea>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn color="primary" @click="saveEditedgallerie">Enregistrer</v-btn>
                    <v-btn color="error" @click="cancelEditgallerie">Annuler</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-btn color="error" @click="deletegallerie(gallerie)">Supprimer</v-btn>
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
      editedgallerie: {
        id: null,
        name: '',
        description: '',
      },
      galleries: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchgalleries();
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
      //formData.append('file', this.formData.file);

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/gallerie/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Gallerie créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchgalleries();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Gallerie!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchgalleries(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/galleries', { headers });
        this.galleries = response.data.Galleries.data;
        //console.log(this.galleries)
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des galleries!',
          color: 'error',
        };
      }
    },
    editgallerie(gallerie) {
      this.editedgallerie = {
        id: gallerie.id,
        name: gallerie.name,
        description: gallerie.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedgallerie() {
      const payload = {
        name_fr: this.editedgallerie.name,
        name_ar: this.editedgallerie.name,
        name_en: this.editedgallerie.name,
        description_fr: this.editedgallerie.description,
        description_ar: this.editedgallerie.description,
        description_en: this.editedgallerie.description,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/gallerie/update/${this.editedgallerie.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Gallerie modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchgalleries();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Gallerie!',
          color: 'error',
        };
      }
    },
    cancelEditgallerie() {
      this.dialogVisible = false;
    },
    async deletegallerie(gallerie) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/gallerie/${gallerie.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Gallerie supprimée avec succès!',
            color: 'success',
          };
          this.fetchgalleries();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Gallerie!',
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

.galleries-title {
  margin-top: 30px;
}

.galleries-container {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 5px;
}

.gallerie-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.gallerie-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>