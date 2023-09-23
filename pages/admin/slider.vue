<template>
  <div>
    <h1 class="centered-title green-title bigger-title">sliders</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[SliderRule]" required></v-textarea>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="sliders.length" class="centered-container">
      <h2 class="sliders-title green-title">Liste des sliders</h2>
      <ul>
        <li v-for="Slider in sliders" :key="Slider.id" class="Slider-item">
          <div class="Slider-data">
            <h3> Name:{{ Slider.name }}</h3>
            <p>Description:{{ Slider.description }}</p>
          </div>

          <div class="Slider-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editSlider(Slider)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la Slider</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedSlider.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedSlider.description" label="Description" :rules="[SliderRule]"
                    required></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedSlider">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditSlider">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deleteSlider(Slider)">Supprimer</v-btn>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script >
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';
import Pagination from '~/components/Pagination.vue';
import { useAdminStore } from '@/store/auth';


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
        userId: null,
      },
      dialogVisible: false,
      editedSlider: {
        id: null,
        name: '',
        description: '',
      },

      sliders: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  created() {
    if (this.userId === null) {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId !== null) {
        this.userId = storedUserId;
      }
    }
    this.fetchsliders();
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
      formData.append('description_fr', this.formData.description);
      formData.append('description_ar', this.formData.description);
      formData.append('description_en', this.formData.description);
      formData.append('user_id', this.userId);
      //console.log(this.userId)
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        this.formData.user_id = this.userId ? parseInt(this.userId) : null;
        await axios.post('https://api.srtk.com.tn/api/admin/slider/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Slider créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchsliders();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Slider!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchsliders(pageNumber = 1) {

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/sliders', { headers });
        this.sliders = response.data.Sliders.data;

      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des sliders!',
          color: 'error',
        };
      }
    },
    editSlider(Slider) {
      this.editedSlider = {
        id: Slider.id,
        name: Slider.name,
        description: Slider.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedSlider() {
      const payload = {
        name_fr: this.editedSlider.name,
        name_ar: this.editedSlider.name,
        name_en: this.editedSlider.name,
        description_fr: this.editedSlider.description,
        description_ar: this.editedSlider.description,
        description_en: this.editedSlider.description,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/slider/update/${this.editedSlider.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Slider modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchsliders();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Slider!',
          color: 'error',
        };
      }
    },
    cancelEditSlider() {
      this.dialogVisible = false;
    },
    async deleteSlider(Slider) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/slider/${Slider.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Slider supprimée avec succès!',
            color: 'success',
          };
          this.fetchsliders();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Slider!',
          color: 'error',
        };
      }
    },
  },
  computed: {
    userId: {
      get() {
        return localStorage.getItem('userId');
      },
      set(value) {
        localStorage.setItem('userId', value);
      },
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

.sliders-title {
  margin-top: 30px;
}

.Slider-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.Slider-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>