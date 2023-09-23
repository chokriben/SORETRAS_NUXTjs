<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Gares</h1>
    <v-table height="700" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">titre</th>

          <th class="text-uppercase">Action</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="item in gares" :key="item.id">
          <td>{{ item.name }}</td>



          <td class="text-center">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="editgare(item)"><v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la gare</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedgare.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedgare.description" label="Description" :rules="[gareRule]"
                    required></v-textarea>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedgare.longitude" label="Longitude" prepend-inner-icon="mdi-map-marker"
                        placeholder="Enter longitude"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedgare.latitude" label="Latitude" prepend-inner-icon="mdi-map-marker"
                        placeholder="Enter latitude"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedgare">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditgare">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn variant="text" color="green" fab small @click="deletegare(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

  </div>
</template>
<script>
import axios from 'axios';
import { onMounted } from 'vue'
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
        name: '',
        description: '',
        latitude: '',
        longitude: '',
      },
      dialogVisible: false,
      editedgare: {
        id: null,
        name: '',
        description: '',
        latitude: '',
        longitude: '',
      },
      gares: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.checkAdminAuthentication();
    this.fetchGares();
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
      formData.append('name_fr', this.formData.name);
      formData.append('name_ar', this.formData.name);
      formData.append('name_en', this.formData.name);
      formData.append('description_fr', this.formData.description);
      formData.append('description_ar', this.formData.description);
      formData.append('description_en', this.formData.description);
      formData.append('latitude', this.formData.latitude);
      formData.append('longitude', this.formData.longitude);
      formData.append('DemandeAbonnement_id', 1);
      formData.append('ville_id', 2);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/gare/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'gare créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchGares();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la gare!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
      this.formData.latitude = '';
      this.formData.longitude = '';

    },
    async fetchGares(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/gares', { headers });
        this.gares = response.data.Gares.data;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des gares!',
          color: 'error',
        };
      }
    },
    editgare(gare) {
      this.editedgare = {
        id: gare.id,
        name: gare.name,
        description: gare.description,
        longitude: gare.longitude,
        latitude: gare.latitude,
      };
      this.dialogVisible = true;
    },
    async saveEditedgare() {
      const payload = {
        name_fr: this.editedgare.name,
        name_ar: this.editedgare.name,
        name_en: this.editedgare.name,
        description_fr: this.editedgare.description,
        description_ar: this.editedgare.description,
        description_en: this.editedgare.description,
        latitude: this.editedgare.latitude,
        longitude: this.editedgare.longitude,
        DemandeAbonnement_id: 1,
        ville_id: 2,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/gare/update/${this.editedgare.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'gare modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchGares();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la gare!',
          color: 'error',
        };
      }
    },
    cancelEditgare() {
      this.dialogVisible = false;
    },
    async deletegare(gare) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/gare/${gare.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'gare supprimée avec succès!',
            color: 'success',
          };
          this.fetchGares();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la gare!',
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

.gares-title {
  margin-top: 30px;
}

.gare-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.gare-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}

@media (max-width: 600px) {
  .gare-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .gare-data {
    margin-bottom: 10px;
  }

  .gare-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>