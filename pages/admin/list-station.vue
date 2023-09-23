<template>
  <div>
    <h1 class="centered-title green-title bigger-title">stations</h1>

    <v-table height="700" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">titre</th>
          <th class="text-uppercase">Description</th>
          <th class="text-uppercase">date</th>
          <th class="text-uppercase">Action</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="item in stations" :key="item.id">
          <td>{{ item.name }}</td>

          <td>{{ item.gare_id }}</td>
          <td>{{ item.ligne_id }}</td>

          <td class="text-center">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editstation(item)"> <v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la station</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedstation.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedstation.description" label="Description" :rules="[stationRule]"
                    required></v-textarea>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedstation.longitude" label="Longitude"
                        prepend-inner-icon="mdi-map-marker" placeholder="Enter longitude"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedstation.latitude" label="Latitude" prepend-inner-icon="mdi-map-marker"
                        placeholder="Enter latitude"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <v-text-field v-model="editedstation.code" label="Code" prepend-inner-icon="mdi-numeric"
                        placeholder="Enter code"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedstation">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditstation">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn variant="text" color="green" fab small @click="deletestation(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <pagination :currentPage="currentPage" :totalPages="totalPages" @pageChanged="changePage" />
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
        code: '',
      },
      dialogVisible: false,
      editedstation: {
        id: null,
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        code: '',
      },
      stations: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.checkAdminAuthentication();
    this.fetchstations();
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
      formData.append('code', this.formData.code);
      formData.append('ligne_id', 2);
      formData.append('ville_id', 2);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/station/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'station créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchstations();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la station!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
      this.formData.latitude = '';
      this.formData.longitude = '';
      this.formData.code = '';

    },
    async fetchstations(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/stations', { headers });
        this.stations = response.data.stations.data;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des stations!',
          color: 'error',
        };
      }
    },
    editstation(station) {
      this.editedstation = {
        id: station.id,
        name: station.name,
        description: station.description,
        longitude: station.longitude,
        latitude: station.latitude,
        code: station.code,
      };
      this.dialogVisible = true;
    },
    async saveEditedstation() {
      const payload = {
        name_fr: this.editedstation.name,
        name_ar: this.editedstation.name,
        name_en: this.editedstation.name,
        description_fr: this.editedstation.description,
        description_ar: this.editedstation.description,
        description_en: this.editedstation.description,
        latitude: this.editedstation.latitude,
        longitude: this.editedstation.longitude,
        code: this.editedstation.code,
        ligne_id: 2,
        ville_id: 2,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/station/update/${this.editedstation.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'station modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchstations();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la station!',
          color: 'error',
        };
      }
    },
    cancelEditstation() {
      this.dialogVisible = false;
    },
    async deletestation(station) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/station/${station.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'station supprimée avec succès!',
            color: 'success',
          };
          this.fetchstations();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la station!',
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

.stations-title {
  margin-top: 30px;
}

.station-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.station-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}

@media (max-width: 600px) {
  .station-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .station-data {
    margin-bottom: 10px;
  }

  .station-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>