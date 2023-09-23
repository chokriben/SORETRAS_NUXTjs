<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Actualite</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        required></v-textarea>
      <v-text-field v-model="formData.date" type="date" label="Date" prepend-inner-icon="mdi-calendar-month"
        required></v-text-field>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

  </div>
</template>

<script>
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';
import Pagination from '~/components/Pagination.vue';
//import { getUserId  } from '@/store/auth';
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
        date: '',


      },
      dialogVisible: false,
      editedactualite: {
        id: null,
        name: '',
        description: '',
        date: '',


      },
      actualites: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      userId: null,
    };
  },
  mounted() {
    this.fetchUserId();
    this.fetchactualites();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    fetchUserId() {
      this.userId = localStorage.getItem('userId');
    },

    async handleSubmit() {
      console.log(this.userId);
      const formData = new FormData();
      formData.append('name_fr', this.formData.name);
      formData.append('name_ar', this.formData.name);
      formData.append('name_en', this.formData.name);
      formData.append('description_fr', this.formData.description);
      formData.append('description_ar', this.formData.description);
      formData.append('description_en', this.formData.description);
      formData.append('user_id', this.userId); // Use the dynamic userId value
      formData.append('ville_id', 1);
      formData.append('date', this.formData.date);





      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/actualite/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'actualite créé avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchactualites();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création du actualite!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
      this.formData.date = '';


    },
    async fetchactualites(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/actualites', { headers });
        this.actualites = response.data.actualites.data.map((actualite) => ({
          id: actualite.id,
          name: actualite.name,
          description: actualite.description,
          date: actualite.date,


        }));
        this.totalPages = Math.ceil(response.data.actualites.total / response.data.actualites.per_page);
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des actualites!',
          color: 'error',
        };
      }
    },
    handleGoToPage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchactualites(pageNumber);
    },
    editactualite(actualite) {
      this.editedactualite = {
        id: actualite.id,
        name: actualite.name,
        description: actualite.description,
        date: actualite.date,
        date_fin: actualite.date_fin,
        //filename :actualite.filename,
      };
      this.dialogVisible = true;
    },
    async saveEditedactualite() {
      const payload = {
        name_fr: this.editedactualite.name,
        name_ar: this.editedactualite.name,
        name_en: this.editedactualite.name,
        description_fr: this.editedactualite.description,
        description_ar: this.editedactualite.description,
        description_en: this.editedactualite.description,

        date: this.editedactualite.date,

        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/actualite/update/${this.editedactualite.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'actualite modifié avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchactualites();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification du actualite!',
          color: 'error',
        };
      }
    }
    ,
    cancelEditactualite() {
      this.dialogVisible = false;
    },
    async deleteactualite(actualite) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/actualite/${actualite.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'actualite supprimé avec succès!',
            color: 'success',
          };
          this.fetchactualites();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression du actualite!',
          color: 'error',
        };
      }
    },
  },
};
</script>
<style scoped>
.actualites-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.actualite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.actualites-title {
  margin-top: 40px;
  font-size: 24px;
}

.green-title {
  color: green;
}


.actualite-data {
  flex: 1;
}

.centered-title {
  text-align: center;

}

.green-title {
  color: green;
}

.actualite-actions {
  margin-left: 10px;
}

.bigger-title {
  font-size: 2.5rem;
  /* Ajoutez ici la taille de police souhaitée */
}
</style>
