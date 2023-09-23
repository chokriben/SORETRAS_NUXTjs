
<template>
  <div>
    <h1 class="centered-title green-title bigger-title">Setting</h1>
    <v-form @submit.prevent="handleSubmit">
      <VTextField v-model="formData.raison_sociale" prepend-inner-icon="mdi-office-building" label="Raison sociale"
        placeholder="Raison sociale " />
      <VTextField v-model="formData.adresse" prepend-inner-icon="mdi-map-marker" label="Adresse" placeholder="Adresse" />
      <VTextField v-model="formData.email" prepend-inner-icon="mdi-email-outline" label="Email" type="email"
        placeholder="Email" />
      <VTextField v-model="formData.num_tel_s" prepend-inner-icon="mdi-phone" label="Téléphone 1" type="text"
        placeholder="Téléphone 1" />
      <VTextField v-model="formData.num_tel_p" prepend-inner-icon="mdi-phone" label="Téléphone 2" type="number"
        placeholder="Téléphone 2" />
      <VTextField v-model="formData.fax_s" prepend-inner-icon="mdi-fax" label="Fax 1" type="number" placeholder="Fax 1" />
      <VTextField v-model="formData.fax_p" prepend-inner-icon="mdi-fax" label="Fax 2" type="number" placeholder="Fax 2" />
      <VTextField v-model="formData.facebook" prepend-inner-icon="mdi-facebook" label="Facebook" placeholder="Facebook" />
      <VTextField v-model="formData.youtube" prepend-inner-icon="mdi-youtube" label="Youtube" placeholder="Youtube" />
      <VTextField v-model="formData.twitter" prepend-inner-icon="mdi-twitter" label="Twitter" placeholder="Twitter" />
      <v-btn color="primary" type="submit">Créer</v-btn>
    </v-form>

    <div v-if="settings.length" class="centered-container">
      <h2 class="settings-title green-title">Liste des settings</h2>
      <ul>
        <li v-for="Setting in settings" :key="Setting.id" class="Setting-item">
          <div class="Setting-data">
            <h3>{{ Setting.raison_sociale }}</h3>
            <p>{{ Setting.adresse }}</p>
            <p>email : {{ Setting.email }}</p>
            <p>telephone 1:{{ Setting.num_tel_s }}</p>
            <p>telephone 2: {{ Setting.num_tel_p }}</p>
            <p>fax1 : {{ Setting.fax_s }}</p>
            <p>fax 2 : {{ Setting.fax_p }}</p>
            <p>facebook : {{ Setting.facebook }}</p>
            <p>youtube: {{ Setting.youtube }}</p>
            <p>twitter : {{ Setting.twitter }}</p>
          </div>

          <div class="Setting-actions">
            <v-dialog v-model="dialogVisible" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" @click="editSetting(Setting)">Modifier</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Modifier le Setting</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="editedSetting.raison_sociale" label="raison sociale" required></v-text-field>
                  <v-textarea v-model="editedSetting.adresse" label="adresse" required></v-textarea>
                  <v-text-field v-model="editedSetting.email" label="email" required></v-text-field>
                  <v-text-field v-model="editedSetting.num_tel_s" label="Téléphone 1" required></v-text-field>
                  <v-text-field v-model="editedSetting.num_tel_p" label="Téléphone 2" required></v-text-field>
                  <v-text-field v-model="editedSetting.fax_s" label="Fax 1" required></v-text-field>
                  <v-text-field v-model="editedSetting.fax_p" label="Fax 2" required></v-text-field>
                  <v-text-field v-model="editedSetting.facebook" label="facebook" required></v-text-field>
                  <v-text-field v-model="editedSetting.youtoub" label="youtoub" required></v-text-field>
                  <v-text-field v-model="editedSetting.twitter" label="twitter" required></v-text-field>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="saveEditedSetting">Enregistrer</v-btn>
                  <v-btn color="error" @click="cancelEditSetting">Annuler</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="error" @click="deleteSetting(Setting)">Supprimer</v-btn>
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
        raison_sociale: '',
        adresse: '',
        email: '',
        num_tel_s: '',
        num_tel_p: '',
        fax_s: '',
        fax_p: '',
        facebook: '',
        youtube: '',
        twitter: '',
      },
      dialogVisible: false,
      editedSetting: {
        id: null,
        raison_sociale: '',
        adresse: '',
        email: '',
        num_tel_s: '',
        num_tel_p: '',
        fax_s: '',
        fax_p: '',
        facebook: '',
        youtoub: '',
        twitter: '',

      },
      settings: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  created() {
    this.fetchSetting();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    async handleSubmit() {
      const formData = new FormData();
      formData.append('raison_sociale_fr', this.formData.raison_sociale);
      formData.append('raison_sociale_ar', this.formData.raison_sociale);
      formData.append('raison_sociale_en', this.formData.raison_sociale);
      formData.append('adresse_fr', this.formData.adresse);
      formData.append('adresse_ar', this.formData.adresse);
      formData.append('adresse_en', this.formData.adresse);
      formData.append('facebook', this.formData.facebook);
      formData.append('youtoub', this.formData.youtoub);
      formData.append('twitter', this.formData.twitter);
      formData.append('email', this.formData.email);
      formData.append('num_tel_s', this.formData.num_tel_s);
      formData.append('num_tel_p', this.formData.num_tel_p);
      formData.append('fax_s', this.formData.fax_s);
      formData.append('fax_p', this.formData.fax_p);
      //formData.append('file', this.$refs.fileInput.files[0]);
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      try {
        await axios.post('https://api.srtk.com.tn/api/admin/setting/add', formData, { headers });
        this.snackbar = {
          show: true,
          message: 'Setting créé avec succès!',
          color: 'success',
        };
        this.resetForm();
        this.fetchSetting();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la création du Setting!',
          color: 'error',
        };
      }
    },
    resetForm() {
      this.formData.raison_sociale = '';
      this.formData.adresse = '';
      this.formData.email = '';
      this.formData.num_tel_s = '';

      this.formData.facebook = '';
      this.formData.youtube = '';
      this.formData.twitter = '';
      this.formData.fax_p = '';
      this.formData.fax_s = '';
      this.formData.num_tel_p = '';

    },
    async fetchSetting(pageNumber = 1) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/settings', { headers });
        this.settings = response.data.setting;
        this.formData.raison_sociale = this.settings.raison_sociale;
        this.formData.adresse = this.settings.adresse;
        this.formData.email = this.settings.email;
        this.formData.num_tel_s = this.settings.num_tel_s;
        this.formData.num_tel_p = this.settings.num_tel_p;
        this.formData.fax_s = this.settings.fax_s;
        this.formData.fax_p = this.settings.fax_p;
        this.formData.facebook = this.settings.facebook;
        this.formData.youtube = this.settings.youtube;
        this.formData.twitter = this.settings.twitter;
        //console.log(this.settings)


      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des settings!',
          color: 'error',
        };
      }
    },
    editSetting(Setting) {
      this.editedSetting = {
        id: Setting.id,
        raison_sociale: Setting.raison_sociale,
        adresse: Setting.adresse,
        email: Setting.email,
        num_tel_s: Setting.num_tel_s,
        facebook: Setting.facebook,
        twitter: Setting.twitter,
        youtoub: Setting.youtube,
        num_tel_p: Setting.num_tel_p,
        fax_p: Setting.fax_p,
        fax_s: Setting.fax_s,
        //fileraison_sociale :Setting.fileraison_sociale,
      };
      this.dialogVisible = true;
    },
    async saveEditedSetting() {
      const payload = {
        raison_sociale_fr: this.editedSetting.raison_sociale,
        raison_sociale_ar: this.editedSetting.raison_sociale,
        raison_sociale_en: this.editedSetting.raison_sociale,
        adresse_fr: this.editedSetting.adresse,
        adresse_ar: this.editedSetting.adresse,
        adresse_en: this.editedSetting.adresse,

        facebook: this.editedSetting.facebook,
        youtoub: this.editedSetting.youtoub,
        twitter: this.editedSetting.twitter,

        fax_s: this.editedSetting.fax_s,
        fax_p: this.editedSetting.fax_p,
        num_tel_p: this.editedSetting.num_tel_p,

        email: this.editedSetting.email,
        num_tel_s: this.editedSetting.num_tel_s,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(`https://api.srtk.com.tn/api/admin/setting/update/${this.editedSetting.id}`, payload, { headers });
        this.snackbar = {
          show: true,
          message: 'Setting modifié avec succès!',
          color: 'success',
        };
        this.dialogVisible = false;
        this.fetchSetting();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification du Setting!',
          color: 'error',
        };
      }
    }
    ,
    cancelEditSetting() {
      this.dialogVisible = false;
    },
    async deleteSetting(Setting) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.delete(`https://api.srtk.com.tn/api/admin/setting/${Setting.id}`, { headers });
        this.snackbar = {
          show: true,
          message: 'Setting supprimé avec succès!',
          color: 'success',
        };
        this.fetchSetting();
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression du Setting!',
          color: 'error',
        };
      }
    },
  },
};
</script>
<style scoped>
.settings-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.Setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
}

.settings-title {
  margin-top: 40px;
  font-size: 24px;
}

.green-title {
  color: green;
}


.Setting-data {
  flex: 1;
}

.centered-title {
  text-align: center;

}

.green-title {
  color: green;
}

.Setting-actions {
  margin-left: 10px;
}

.bigger-title {
  font-size: 2.5rem;
  /* Ajoutez ici la taille de police souhaitée */
}
</style>
