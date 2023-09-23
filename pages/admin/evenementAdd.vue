<template>
  <div>
    <h1 class="text-center text-success display-4">Événement</h1>
    <v-form @submit.prevent="handleSubmit">
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
        {{ snackbar.message }}
      </v-snackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        required></v-textarea>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="formData.date_debut" type="date" color="primary" label="Date Debut"
            prepend-inner-icon="mdi-calendar-month"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="formData.date_fin" type="date" color="primary" label="Date Fin"
            prepend-inner-icon="mdi-calendar-month"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <input type="file" @change="onFileChange"
            accept=".jpg, .png, .jpeg, .csv, .txt, .xls, .xlsx, .pdf, .mp3, .mp4" />
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn color="primary" type="submit">Créer</v-btn>
        </v-col>
      </v-row>
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

      file: null,
      userId: null,
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

  mounted() {
    this.fetchUserId();
    this.fetchevenements();
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
        user_id: 1,
        ville_id: 1,
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
