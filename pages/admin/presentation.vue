<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Ajouter page</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[descriptionRule]" required></v-textarea>

      <input type="file" @change="onFileChange" accept=".jpg, .png, .jpeg, .csv, .txt, .xls, .xlsx, .pdf, .mp3, .mp4" />

      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios library to make HTTP requests

const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
definePageMeta({
  layout: "admin",
});
export default {
  data() {
    return {
      file: null,
      formData: {
        name: '',
        description: '',
      },
      presentations: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
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

      if (this.file) {
        formData.append('file', this.file);
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/presentation/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Présentation créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        // this.fetchPresentations(); // You should implement the fetchPresentations method
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
            message: 'Échec de la création de la présentation!',
            color: 'error',
          };
        }
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
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

.presentations-title {
  margin-top: 30px;
}

.presentation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.presentation-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
