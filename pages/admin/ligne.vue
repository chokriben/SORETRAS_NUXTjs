<template>
  <div>
    <h1 class="centered-title green-title bigger-title">lignes</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-row>
        <v-col cols="12" sm="6">

          <v-text-field v-model="formData.name" label="name" prepend-icon="mdi-account" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="formData.code" label="code" prepend-icon="mdi-account" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <select v-model="formData.selectedGareId" class="forms" autocomplete>
            <option value="null">Sélectionnez une gare</option>
            <option v-for="gare in formData.garess" :value="gare.id">{{ gare.name }}</option>
          </select>
        </v-col>
        <v-col cols="12" sm="6">

        </v-col>
        <v-col cols="12" sm="6">
          <select v-model="formData.selectedstationdep" class="forms" autocomplete>
            <option value="null">Sélectionnez station dep</option>
            <option v-for="gare in formData.stations" :value="gare.id">{{ gare.name }}</option>
          </select>
        </v-col>
        <v-col cols="12" sm="6">
          <select v-model="formData.selectedstationar" class="forms" autocomplete>
            <option value="null">Sélectionnez station ar</option>
            <option v-for="gare in formData.stations" :value="gare.id">{{ gare.name }}</option>
          </select>
        </v-col>
      </v-row>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>


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
        code: '',
        garess: [],
        stations: [],
        selectedGareId: null,
        selectedstationdep: null,
        selectedstationar: null,
      },
      dialogVisible: false,
      editedLigne: {
        id: null,
        name: '',

      },
      lignes: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchLignes();
    // Fetch gares
    this.fetchgares();
    this.fetchstation();
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
      formData.append('code', this.formData.code);
      formData.append('gare', this.formData.selectedGareId);
      formData.append('stationdep', this.formData.selectedstationdep);
      formData.append('stationar', this.formData.selectedstationar);




      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/ligne/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Ligne créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchLignes();

        this.$router.push({ path: '/admin/lignes' });
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Ligne!',
          color: 'error',
        };
      }
    },


    resetForm() {
      this.formData.name = '';

    },
    async fetchLignes(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/lignes', { headers });
        this.lignes = response.data.lignes;
        //console.log(this.lignes)

      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des lignes!',
          color: 'error',
        };
      }
    },
    async fetchgares() {

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/gares');
        // Assign the retrieved data to the formData property
        this.formData.garess = response.data.Gares.data;
      } catch (error) {
        console.error('Error fetching gares:', error);
      }
    },
    async fetchstation() {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get('https://api.srtk.com.tn/api/admin/stations', { headers });
        // Assign the retrieved data to the formData property
        this.formData.stations = response.data.stations.data;
      } catch (error) {
        console.error('Error fetching gares:', error);
      }
    },
    editLigne(Ligne) {
      this.editedLigne = {
        id: Ligne.id,
        name: Ligne.name,

      };
      this.dialogVisible = true;
    },
    async saveEditedLigne() {
      const payload = {
        name_: this.editedLigne.name,
        description: this.editedLigne.description,


        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/ligne/update/${this.editedLigne.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Ligne modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchLignes();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Ligne!',
          color: 'error',
        };
      }
    },
    cancelEditLigne() {
      this.dialogVisible = false;
    },
    async deleteLigne(Ligne) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/ligne/${Ligne.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Ligne supprimée avec succès!',
            color: 'success',
          };
          this.fetchLignes();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Ligne!',
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

.lignes-title {
  margin-top: 30px;
}

.Ligne-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.Ligne-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
