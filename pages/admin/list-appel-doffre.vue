<template>
  <div>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}
    </VSnackbar>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">

        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher Etablissement"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchEtablissements"></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <h2 class="centered-title green-title bigger-title">Liste des Appels d'offres</h2>
    <v-table height="480" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">Titre</th>
          <th class="text-uppercase">Description</th>
          <th class="text-uppercase">Date début</th>
          <th class="text-uppercase">Date fin</th>
          <th class="text-uppercase">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="AppelDoffre in appel_doffres" :key="AppelDoffre.id">
          <td>{{ AppelDoffre.name }}</td>
          <td>{{ AppelDoffre.description }}</td>
          <td>{{ AppelDoffre.date_debut }}</td>
          <td>{{ AppelDoffre.date_fin }}</td>
          <td>
            <!-- Bouton pour ouvrir le dialogue de modification -->
            <v-btn color="primary" @click="openEditDialog(AppelDoffre)">Modifier</v-btn>

            <!-- Dialogue de modification -->
            <v-dialog v-model="editDialogVisible" max-width="500px">
              <v-card>
                <v-card-title>Modifier l'Appel d'offres</v-card-title>
                <v-card-text>
                  <!-- Formulaire de modification avec les champs appropriés -->
                  <v-text-field label="Titre" prepend-icon="mdi-file-document"
                    v-model="editedAppelDoffre.name"></v-text-field>

                  <v-textarea v-model="editedAppelDoffre.description" prepend-icon="mdi-file-document" label="Description"
                    required></v-textarea>
                  <v-text-field label="Date début" type="date" prepend-inner-icon="mdi-calendar-month"
                    v-model="editedAppelDoffre.date_debut"></v-text-field>
                  <v-text-field label="Date fin" type="date" prepend-inner-icon="mdi-calendar-month"
                    v-model="editedAppelDoffre.date_fin"></v-text-field>
                  <!-- ... Autres champs ... -->
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedAppelDoffre">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditAppelDoffre">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
          <td> <v-dialog v-model="confirmDeleteDialogVisible" max-width="500px">


              <v-card>
                <v-card-title>Confirmer la suppression</v-card-title>
                <v-card-text>
                  Êtes-vous sûr de vouloir supprimer cet appel d'offres ?
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="cancelDelete">Annuler</v-btn>
                  <v-btn color="error" @click="deleteAppelDoffreConfirmed">Confirmer</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn color="error" @click="confirmDelete(AppelDoffre)">Supprimer</v-btn>

          </td>
        </tr>

      </tbody>
    </v-table>

  </div>
</template>



<script>
definePageMeta({
  layout: "admin",
});
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
      confirmDeleteDialogVisible: false,
      appelDoffreToDelete: null,
      editDialogVisible: false,
      file: null,
      formData: {
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',

      },


      editedAppelDoffre: {
        id: null,
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',

      },
      appel_doffres: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchAppelDoffres();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    confirmDelete(AppelDoffre) {
      this.appelDoffreToDelete = AppelDoffre;
      this.confirmDeleteDialogVisible = true;
    },

    cancelDelete() {
      this.confirmDeleteDialogVisible = false;
    },

    async deleteAppelDoffreConfirmed() {
      if (this.appelDoffreToDelete) {
        // Supprimez l'appel d'offres ici en utilisant this.appelDoffreToDelete
        await this.deleteAppelDoffre(this.appelDoffreToDelete);
        // Réinitialisez la variable et fermez la boîte de dialogue
        this.appelDoffreToDelete = null;
        this.confirmDeleteDialogVisible = false;
      }
    },
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async handleSubmit() {
      const formData = new FormData();
      formData.append('name_fr', this.formData.name);
      formData.append('name_ar', this.formData.name);
      formData.append('name_en', this.formData.name);
      formData.append('description_fr', this.formData.description);
      formData.append('description_ar', this.formData.description);
      formData.append('description_en', this.formData.description);
      formData.append('user_id', 1);
      formData.append('ville_id', 1);
      formData.append('date_debut', this.formData.date_debut);
      formData.append('date_fin', this.formData.date_fin);




      if (this.file) {
        formData.append('file', this.file);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/appel_doffre/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'AppelDoffre créé avec succès!',
          color: 'success',
        };
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errorsValidation) {
          this.snackbar = {
            show: true,
            message: error.response.data.errorsValidation.file[0],
            color: 'error',
          };
        } else {
          console.error(error);
          this.snackbar = {
            show: true,
            message: 'Échec de la création de la appel affores!',
            color: 'error',
          };
        }
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
      this.formData.date_debut = '';
      this.formData.date_fin = '';

    },
    async fetchAppelDoffres(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/appel_doffres', { headers });
        this.appel_doffres = response.data.Appel_doffres.data;
        //console.log(this.appel_doffres)
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des AppelDoffres!',
          color: 'error',
        };
      }
    },
    handleGoToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchAppelDoffres(pageNumber);
    },
    openEditDialog(AppelDoffre) {
      this.editedAppelDoffre = {
        id: AppelDoffre.id,
        name: AppelDoffre.name,
        description: AppelDoffre.description,
        date_debut: AppelDoffre.date_debut,
        date_fin: AppelDoffre.date_fin,
      };
      this.editDialogVisible = true; // Correction ici
    },

    async saveEditedAppelDoffre() {
      const payload = {
        name_fr: this.editedAppelDoffre.name,
        name_ar: this.editedAppelDoffre.name,
        name_en: this.editedAppelDoffre.name,
        description_fr: this.editedAppelDoffre.description,
        description_ar: this.editedAppelDoffre.description,
        description_en: this.editedAppelDoffre.description,
        user_id: 9,
        ville_id: 1,
        date_debut: this.editedAppelDoffre.date_debut,
        date_fin: this.editedAppelDoffre.date_fin,
        active: true,
      };
      this.editDialogVisible = false;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/appel_doffre/update/${this.editedAppelDoffre.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'AppelDoffre modifié avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchAppelDoffres();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification du AppelDoffre!',
          color: 'error',
        };
      }
    }
    ,
    cancelEditAppelDoffre() {
      this.editDialogVisible = false;
    },
    async deleteAppelDoffre(AppelDoffre) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.delete(`https://api.srtk.com.tn/api/admin/appel_doffre/${AppelDoffre.id}`, { headers });
        this.snackbar = {
          show: true,
          message: 'AppelDoffre supprimé avec succès!',
          color: 'success',
        };
        this.fetchAppelDoffres();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression du AppelDoffre!',
          color: 'error',
        };
      }
    },
  },
};
</script>
<style scoped>
/* Ajoutez un style pour les cellules de la table */
.v-table th,
.v-table td {
  border: 1px solid #ccc;
  /* Ajoute une bordure grise autour des cellules */
  padding: 8px;
  /* Ajoute un espacement autour du contenu des cellules */
  text-align: left;
  /* Ajustez l'alignement du texte au besoin */
}

/* Ajoutez un style pour l'en-tête de la table */
.v-table th {
  background-color: #f5f5f5;
  /* Ajoute un arrière-plan gris clair à l'en-tête */
}

/* Si vous souhaitez des lignes zébrées pour une meilleure lisibilité */
.v-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
  /* Couleur de fond pour les lignes paires */
}

/* Ajoutez un style pour les boutons dans les cellules */
.v-table .v-btn {
  margin: 0;
  /* Supprimez la marge autour des boutons si nécessaire */
}

.centered-title {
  text-align: center;
  /* Centre le texte horizontalement */
  color: green;
  /* Donne une couleur verte au texte */
  margin-top: 20px;
  /* Ajustez la marge supérieure au besoin */
  font-size: 24px;
  /* Ajustez la taille de la police au besoin */
}

/* Ajustez d'autres styles au besoin */
</style>

