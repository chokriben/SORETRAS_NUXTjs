<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Demande Abonnement</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-row>
        <v-col cols="6" sm="6">
          <v-textarea v-model="formData.status" label="status" prepend-inner-icon="mdi-office-building"
            :rules="[statusRule]" required></v-textarea>
        </v-col>
        <v-col cols="6" sm="6">
          <v-text-field v-model="formData.date_cmd" label=" date_cmd" prepend-inner-icon="mdi-calendar"
            placeholder="date cmd" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="formData.code_query" label="code_query" prepend-inner-icon="mdi-numeric"
            placeholder="Entrer code query"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="formData.date_reception" label=" date_reception" prepend-inner-icon="mdi-calendar"
            placeholder="date reception" />
        </v-col>
      </v-row>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="demande_abonnements.length" class="centered-container">
      <h2 class="demande_abonnements-title green-title">Liste des demande_abonnements</h2>
      <ul>
        <li v-for="demandeabonnement in demande_abonnements" :key="demandeabonnement.id" class="demandeabonnement-item">
          <div class="demandeabonnement-data">
            <h3>{{ demandeabonnement.date_reception }}</h3>
            <p>{{ demandeabonnement.status }}</p>
            <p>{{ demandeabonnement.date_cmd }}</p>
            <p>{{ demandeabonnement.code_query }}</p>
          </div>

          <div class="demandeabonnement-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editdemandeabonnement(demandeabonnement)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la demande Abonnement</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editeddemandeabonnement.date_reception" label="date reception"
                    required></v-text-field>
                  <v-textarea v-model="editeddemandeabonnement.status" label="status" :rules="[demandeabonnementRule]"
                    required></v-textarea>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editeddemandeabonnement.date_cmd" label="date cmd"
                        prepend-inner-icon="mdi-map-marker" placeholder="Enter longitude"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editeddemandeabonnement.code_query" label="code query"
                        prepend-inner-icon="mdi-map-marker" placeholder="Enter latitude"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditeddemandeabonnement">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditdemandeabonnement">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deletedemandeabonnement(demandeabonnement)">Supprimer</v-btn>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mounted } from 'vue'
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
      currentPage: 1,
      formData: {
        date_reception: '',
        status: '',
        date_cmd: '',
        code_query: '',
      },
      dialogVisible: false,
      editeddemandeabonnement: {
        id: null,
        date_reception: '',
        status: '',
        date_cmd: '',
        code_query: '',
      },
      demande_abonnements: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.checkAdminAuthentication();
    this.fetchDemandeAbonnements();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    checkAdminAuthentication() {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to the login page or perform any desired action
        this.$router.push('/admin/auth/login');
      } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
    async handleSubmit() {
      const formData = new FormData();
      formData.append('date_reception', this.formData.date_reception);
      formData.append('status', this.formData.status);
      formData.append('date_cmd', this.formData.date_cmd);
      formData.append('code_query', this.formData.code_query);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/demandeabonnement/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'demandeabonnement créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchDemandeAbonnements();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la demandeabonnement!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.date_reception = '';
      this.formData.date_cmd = '';
      this.formData.status = '';
      this.formData.code_query = '';

    },
    async fetchDemandeAbonnements(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/demandeabonnements', { headers });
        this.demande_abonnements = response.data.DemandeAbonnements.data;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des demande_abonnements!',
          color: 'error',
        };
      }
    },
    editdemandeabonnement(demandeabonnement) {
      this.editeddemandeabonnement = {
        id: demandeabonnement.id,
        date_reception: demandeabonnement.date_reception,
        date_cmd: demandeabonnement.date_cmd,
        status: demandeabonnement.status,
        code_query: demandeabonnement.code_query,
      };
      this.dialogVisible = true;
    },
    async saveEditeddemandeabonnement() {
      const payload = {
        date_cmd: this.editeddemandeabonnement.date_cmd,
        date_cmd: this.editeddemandeabonnement.date_cmd,
        code_query: this.editeddemandeabonnement.code_query,
        status: this.editeddemandeabonnement.status,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/demandeabonnement/update/${this.editeddemandeabonnement.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'demandeabonnement modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchDemandeAbonnements();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la demandeabonnement!',
          color: 'error',
        };
      }
    },
    cancelEditdemandeabonnement() {
      this.dialogVisible = false;
    },
    async deletedemandeabonnement(demandeabonnement) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/demandeabonnement/${demandeabonnement.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'demandeabonnement supprimée avec succès!',
            color: 'success',
          };
          this.fetchDemandeAbonnements();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la demandeabonnement!',
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

.demande_abonnements-title {
  margin-top: 30px;
}

.demandeabonnement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.demandeabonnement-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}

@media (max-width: 600px) {
  .demandeabonnement-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .demandeabonnement-data {
    margin-bottom: 10px;
  }

  .demandeabonnement-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>