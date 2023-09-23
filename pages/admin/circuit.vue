<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Circuit</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <v-text-field v-model="formData.name" label="Nom" prepend-icon="mdi-account" required></v-text-field>
      <v-textarea v-model="formData.description" label="Description" prepend-icon="mdi-file-document"
        :rules="[CircuitRule]" required></v-textarea>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="circuits.length" class="centered-container">
      <h2 class="circuits-title green-title">Liste des Circuits</h2>
      <ul>
        <li v-for="Circuit in circuits" :key="Circuit.id" class="Circuit-item">
          <div class="Circuit-data">
            <h3>{{ Circuit.name }}</h3>
            <p>{{ Circuit.description }}</p>
          </div>

          <div class="Circuit-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editCircuit(Circuit)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la Circuit</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedCircuit.name" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedCircuit.description" label="Description" :rules="[CircuitRule]"
                    required></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedCircuit">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditCircuit">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deleteCircuit(Circuit)">Supprimer</v-btn>
          </div>
        </li>
      </ul>
    </div>
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
        description: '',
      },
      dialogVisible: false,
      editedCircuit: {
        id: null,
        name: '',
        description: '',
      },
      circuits: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchCircuits();
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
      formData.append('ligne_id', 2);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/circuit/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Circuit créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchCircuits();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Circuit!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.name = '';
      this.formData.description = '';
    },
    async fetchCircuits(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/circuits', { headers });
        this.circuits = response.data.Circuits.data;

      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des circuits!',
          color: 'error',
        };
      }
    },
    editCircuit(Circuit) {
      this.editedCircuit = {
        id: Circuit.id,
        name: Circuit.name,
        description: Circuit.description,
      };
      this.dialogVisible = true;
    },
    async saveEditedCircuit() {
      const payload = {
        name_fr: this.editedCircuit.name,
        name_ar: this.editedCircuit.name,
        name_en: this.editedCircuit.name,
        description_fr: this.editedCircuit.description,
        description_ar: this.editedCircuit.description,
        description_en: this.editedCircuit.description,
        ligne_id: 2,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/circuit/update/${this.editedCircuit.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Circuit modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchCircuits();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Circuit!',
          color: 'error',
        };
      }
    },
    cancelEditCircuit() {
      this.dialogVisible = false;
    },
    async deleteCircuit(Circuit) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/circuit/${Circuit.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Circuit supprimée avec succès!',
            color: 'success',
          };
          this.fetchCircuits();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Circuit!',
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

.circuits-title {
  margin-top: 30px;
}

.Circuit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.Circuit-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
