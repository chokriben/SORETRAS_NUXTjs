<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Recrutement</h1>
    <v-form @submit.prevent="handleSubmit">
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        required></v-textarea>
      <v-text-field v-model="formData.date_debut" label="Date de début" prepend-icon="mdi-calendar"
        required></v-text-field>
      <v-text-field v-model="formData.date_fin" label="Date de fin" prepend-icon="mdi-calendar" required></v-text-field>




      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="recrutements.length" class="centered-container">
      <h2 class="recrutements-title green-title">Liste des recrutements</h2>
      <ul>
        <li v-for="recrutement in recrutements" :key="recrutement.id" class="recrutement-item">
          <div class="recrutement-data">
            <h3>Nom: {{ recrutement.name }}</h3>
            <p>Description {{ recrutement.description }}</p>
            <p>Date de début : {{ recrutement.date_debut }}</p>
            <p>Date de fin : {{ recrutement.date_fin }}</p>

          </div>

          <div class="recrutement-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editRecrutement(recrutement)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier le recrutement</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedRecrutement.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedRecrutement.description" label="Description" required></v-textarea>
                  <v-text-field v-model="editedRecrutement.date_debut" label="Date de début" required></v-text-field>
                  <v-text-field v-model="editedRecrutement.date_fin" label="Date de fin" required></v-text-field>




                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedRecrutement">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditRecrutement">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deleteRecrutement(recrutement)">Supprimer</v-btn>
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

export default {
  components: {
    Pagination
  },
  data() {
    return {
      currentPage: 1,
      totalPages: 0,
      formData: {
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',

      },
      dialogVisible: false,
      editedRecrutement: {
        id: null,
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',

      },
      recrutements: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchRecrutements();
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
      formData.append('user_id', 9);
      formData.append('ville_id', 2);
      formData.append('date_debut', this.formData.date_debut);
      formData.append('date_fin', this.formData.date_fin);
      //formData.append('file', this.$refs.fileInput.files[0]);



      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/recrutement/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Recrutement créé avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchRecrutements();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création du recrutement!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
      this.formData.date_debut = '';
      this.formData.date_fin = '';

    },
    async fetchRecrutements(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/recrutements', { headers });
        this.recrutements = response.data.Recrutements.data;
        //console.log(this.recrutements)
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des recrutements!',
          color: 'error',
        };
      }
    },
    handleGoToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchRecrutements(pageNumber);
    },
    editRecrutement(recrutement) {
      this.editedRecrutement = {
        id: recrutement.id,
        name: recrutement.name,
        description: recrutement.description,
        date_debut: recrutement.date_debut,
        date_fin: recrutement.date_fin,
        //filename :recrutement.filename,
      };
      this.dialogVisible = true;
    },
    async saveEditedRecrutement() {
      const payload = {
        name_fr: this.editedRecrutement.name,
        name_ar: this.editedRecrutement.name,
        name_en: this.editedRecrutement.name,
        description_fr: this.editedRecrutement.description,
        description_ar: this.editedRecrutement.description,
        description_en: this.editedRecrutement.description,
        user_id: 9,
        ville_id: 2,
        date_debut: this.editedRecrutement.date_debut,
        date_fin: this.editedRecrutement.date_fin,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/recrutement/update/${this.editedRecrutement.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Recrutement modifié avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchRecrutements();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification du recrutement!',
          color: 'error',
        };
      }
    }
    ,
    cancelEditRecrutement() {
      this.dialogVisible = false;
    },
    async deleteRecrutement(recrutement) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.delete(`https://api.srtk.com.tn/api/admin/recrutement/${recrutement.id}`, { headers });
        this.snackbar = {
          show: true,
          message: 'Recrutement supprimé avec succès!',
          color: 'success',
        };
        this.fetchRecrutements();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression du recrutement!',
          color: 'error',
        };
      }
    },
  },
};
</script>
<style scoped>
.recrutements-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.recrutement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.recrutements-title {
  margin-top: 40px;
  font-size: 24px;
}

.green-title {
  color: green;
}


.recrutement-data {
  flex: 1;
}

.centered-title {
  text-align: center;

}

.green-title {
  color: green;
}

.recrutement-actions {
  margin-left: 10px;
}

.bigger-title {
  font-size: 2.5rem;
  /* Ajoutez ici la taille de police souhaitée */
}
</style>
