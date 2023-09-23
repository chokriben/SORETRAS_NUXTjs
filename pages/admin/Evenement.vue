<template>
  <v-card>
    <div>
      <h1 class="centered-title green-title bigger-title">Liste des evenements</h1>


      <div v-if="evenements.length" class="centered-container">


        <v-table height="480" fixed-header>
          <thead>
            <tr>
              <th class="text-uppercase">Nom</th>
              <th class="text-uppercase">Description</th>
              <th class="text-uppercase">Date de debut</th>
              <th class="text-uppercase">Date fin</th>
              <th class="text-uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="evenement in evenements" :key="evenement.id">
              <td>{{ evenement.name }}</td>
              <td>{{ evenement.description }}</td>
              <td>{{ evenement.date_debut }}</td>
              <td>{{ evenement.date_fin }}</td>
              <td> <v-dialog v-model="dialogVisible" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on" @click="editevenement(evenement)">Modifier</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Modifier le evenement</span>
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="editedevenement.name" prepend-icon="mdi-file-document" label="Nom"
                        required></v-text-field>
                      <v-textarea v-model="editedevenement.description" prepend-icon="mdi-file-document"
                        label="Description" required></v-textarea>
                      <v-text-field v-model="editedevenement.date_debut" label="Date de début" type="date"
                        prepend-inner-icon="mdi-calendar-month" required></v-text-field>
                      <v-text-field v-model="editedevenement.date_fin" type="date" label="Date de début"
                        prepend-inner-icon="mdi-calendar-month" required></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn color="primary" @click="saveEditedevenement">Enregistrer</v-btn>
                      <v-btn color="error" @click="cancelEditevenement">Annuler</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-btn color="error" @click="deleteevenement(evenement)">Supprimer</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

      </div>
    </div>
  </v-card>
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

      file: null,

      formData: {
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',

      },
      dialogVisible: false,
      editedevenement: {
        id: null,
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',
      },
      evenements: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  created() {
    this.fetchevenements();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
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


      formData.append('date_debut', this.formData.date_debut);
      formData.append('date_fin', this.formData.date_fin);

      //formData.append('file', this.$refs.fileInput.files[0]);


      if (this.file) {
        formData.append('file', this.file);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/evenement/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'evenement créé avec succès!',
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
            message: 'Échec de la création de la evenement!',
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
    async fetchevenements(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/evenements', { headers });
        this.evenements = response.data.Evenements.data;
        //console.log(this.evenements)

      } catch (error) {
        console.error(error.response.data.message);

        this.snackbar = {
          show: true,
          message: error.response.data.message || 'Échec du chargement des evenements!',
          color: 'error',
        };
      }
    },
    handleGoToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchevenements(pageNumber);
    },
    editevenement(evenement) {
      this.editedevenement = {
        id: evenement.id,
        name: evenement.name,
        description: evenement.description,
        date_debut: evenement.date_debut,
        date_fin: evenement.date_fin,
        //filename :evenement.filename,
      };
      this.dialogVisible = true;
    },
    async saveEditedevenement() {
      const payload = {
        name_fr: this.editedevenement.name,
        name_ar: this.editedevenement.name,
        name_en: this.editedevenement.name,
        description_fr: this.editedevenement.description,
        description_ar: this.editedevenement.description,
        description_en: this.editedevenement.description,

        date_debut: this.editedevenement.date_debut,
        date_fin: this.editedevenement.date_fin,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/evenement/update/${this.editedevenement.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'evenement modifié avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchevenements();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification du evenement!',
          color: 'error',
        };
      }
    }
    ,
    cancelEditevenement() {
      this.dialogVisible = false;
    },
    async deleteevenement(evenement) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/evenement/${evenement.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'evenement supprimé avec succès!',
            color: 'success',
          };
          this.fetchevenements();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression du evenement!',
          color: 'error',
        };
      }
    },
  },
};
</script>
<style scoped>
.evenements-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.evenement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.evenements-title {
  margin-top: 40px;
  font-size: 24px;
}

.green-title {
  color: green;
}


.evenement-data {
  flex: 1;
}

.centered-title {
  text-align: center;

}

.green-title {
  color: green;
}

.evenement-actions {
  margin-left: 10px;
}

.bigger-title {
  font-size: 2.5rem;
  /* Ajoutez ici la taille de police souhaitée */
}
</style>
