<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Appel d'offres</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[AppelDoffreRule]" required></v-textarea>
      <v-text-field v-model="formData.date_debut" color="primary" label="Date de début" type="date"
        prepend-inner-icon="mdi-calendar-month" required></v-text-field>

      <v-text-field v-model="formData.date_fin" color="primary" label="Date de fin" type="date"
        prepend-inner-icon="mdi-calendar-month" required></v-text-field>
      <input type="file" @change="onFileChange" accept=".jpg, .png, .jpeg, .csv, .txt, .xls, .xlsx, .pdf, .mp3, .mp4" />
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>


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
      file: null,
      formData: {
        name: '',
        description: '',
        date_debut: '',
        date_fin: '',

      },
      dialogVisible: false,
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

    this.fetchUserId();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    fetchUserId() {
      this.userId = localStorage.getItem('userId');
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
      formData.append('user_id', this.userId); // Use the dynamic userId value
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




  },
};
</script>
<style scoped>
.AppelDoffres-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.centered-title {
  text-align: center;
}

.AppelDoffre-item {
  flex: 0 0 calc(50% - 10px);
  /* Adjust the width as needed */
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.appel_doffres-title {
  margin-top: 40px;
  font-size: 24px;
}

.green-title {
  color: green;
}


.AppelDoffre-data {
  flex: 1;
}

.centered-title {
  text-align: center;

}

.gray-block {
  background-color: #eee;
  padding: 20px;
  margin-top: 20px;
}

.green-title {
  color: green;
}

.AppelDoffre-actions {
  margin-left: 10px;
}

.bigger-title {
  font-size: 2.5rem;
  /* Ajoutez ici la taille de police souhaitée */
}
</style>
