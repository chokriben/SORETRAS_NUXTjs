<template>
  <div>
    <h1 class="centered-title green-title bigger-title">tarifs</h1>
    <v-form @submit.prevent="handleSubmit">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <VCol cols="6">
        <VTextField v-model="formData.prix" prepend-inner-icon="mdi-currency-usd" label="Prix"
          placeholder="Entrez le prix" />
      </VCol>
      <VCol cols="6">
        <VTextField v-model="formData.prix_fixe" prepend-inner-icon="mdi-currency-usd" label="prix fixe"
          placeholder="Entrez le prix fixe" />
      </VCol>
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="tarifs.length" class="centered-container">
      <h2 class="tarifs-title green-title">Liste des tarifs</h2>
      <ul>
        <li v-for="Tarif in tarifs" :key="Tarif.id" class="Tarif-item">
          <div class="Tarif-data">
            <h3>{{ Tarif.prix }}</h3>
            <p>{{ Tarif.prix_fixe }}</p>
          </div>

          <div class="Tarif-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editTarif(Tarif)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier la Tarif</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedTarif.prix" label="Nom" required></v-text-field>
                  <v-textarea v-model="editedTarif.prix_fixe" label="prix_fixe" :rules="[TarifRule]"
                    required></v-textarea>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedTarif">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditTarif">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deleteTarif(Tarif)">Supprimer</v-btn>
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
        prix: '',
        prix_fixe: '',
      },
      dialogVisible: false,
      editedTarif: {
        id: null,
        prix: '',
        prix_fixe: '',
      },
      tarifs: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchTarifs();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    async handleSubmit() {
      const formData = new FormData();
      formData.append('prix', this.formData.prix);
      formData.append('prix_fixe', this.formData.prix_fixe);


      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/tarif/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Tarif créée avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchTarifs();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création de la Tarif!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.prix = '';
      this.formData.prix_fixe = '';
    },
    async fetchTarifs() {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/tarifs', { headers });
        this.tarifs = response.data.tarifs;
        //console.log(this.tarifs)
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des tarifs!',
          color: 'error',
        };
      }
    },
    editTarif(Tarif) {
      this.editedTarif = {
        id: Tarif.id,
        prix: Tarif.prix,
        prix_fixe: Tarif.prix_fixe,
      };
      this.dialogVisible = true;
    },
    async saveEditedTarif() {
      const payload = {
        prix: this.editedTarif.prix,
        prix_fixe: this.editedTarif.prix_fixe,

        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/tarif/update/${this.editedTarif.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Tarif modifiée avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchTarifs();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Tarif!',
          color: 'error',
        };
      }
    },
    cancelEditTarif() {
      this.dialogVisible = false;
    },
    async deleteTarif(Tarif) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/tarif/${Tarif.id}`, { headers });
          this.snackbar = {
            show: true,
            message: 'Tarif supprimée avec succès!',
            color: 'success',
          };
          this.fetchTarifs();
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Tarif!',
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

.tarifs-title {
  margin-top: 30px;
}

.Tarif-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.Tarif-actions {
  display: flex;
  gap: 10px;
}

.centered-container {
  text-align: center;
}
</style>
