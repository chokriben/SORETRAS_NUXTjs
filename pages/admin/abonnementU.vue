<template>
  <div>
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}

    </VSnackbar>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>

        <v-card-text class="dialog-header">
          <span class="dialog-title">Abonnement form</span>
        </v-card-text>
        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.prenom" label="prenom" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.adresse" label="adresse" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.profession" label="profession" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.num_telephone" label="num_telephone" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.date_naissance" label="date de naissance " required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.date_emission" label="date de naissance " required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.cin" label="date de naissance " required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedabonne.code" label="IDENTIFIANT" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateabonneDetails">Update</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher abonne"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchabonnes"></v-text-field>
        </v-col>

      </v-row>
    </v-card>

    <v-table height="720" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">image</th>
          <th class="text-uppercase">Nom</th>
          <th class="text-uppercase">type</th>
          <th class="text-uppercase">adresse</th>
          <th class="text-uppercase">IDENTIFIANT</th>
          <th class="text-uppercase">Gare</th>
          <th class="text-uppercase">profession</th>
          <th class="text-uppercase">Numero de telphone</th>
          <th class="text-uppercase">Date emission</th>
          <th class="text-uppercase">cin</th>
          <th class="text-uppercase">etat</th>
          <th class="text-uppercase">action</th>


        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedabonnes" :key="item.id">
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">
            <v-img :aspect-ratio="16 / 9" cover :src="`https://api.srtk.com.tn/${item.src}`"></v-img>
          </td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.prenom }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession != null">{{ item.type_paiment }}</td>

          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.adresse }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.code }}</td>

          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ getGareName(item.type_zone) || 'N/A' }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.profession }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.num_telephone }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.date_emission }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.cin }}</td>
          <td v-if="item.etat !== 'imprimer' && item.profession !== null">{{ item.etat }}</td>






          <td class="text-center" v-if="item.etat !== 'imprimer' && item.profession !== null">
            <v-btn variant="text" color="green" fab small @click="editabonne(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <a :href="`https://api.srtk.com.tn/api/imprim_abn?id=${item.id}`" target="blank">
              <v-icon>mdi-printer</v-icon>
            </a>

            <v-btn variant="text" color="green" fab small @click="acceptAbonne(item)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn variant="text" color="red" fab small @click="rejectAbonne(item)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="text-center">
      <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" @input="async"
        prev-icon="mdi-chevron-left" next-icon="mdi-chevron-right" color="red"></v-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';

const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
definePageMeta({
  layout: "admin",
});
export default {
  data() {
    return {
      gareNames: {},
      gares: [], // Add this line to store gares data
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 12,
      totalItems: 0,
      abonnes: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedabonne: null,
      editDialog: false,
      editedabonne: {
        id: null,
        prenom: '',


      },
    };
  },
  async created() {
    await this.fetchGares();
    await this.loadGareNamesForAbonnes();
    this.async();
    this.editDialog = false;
  },
  mounted() {
    this.fetchGares(); // Call fetchGares when the component is mounted
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    async loadGareNamesForAbonnes() {
      for (const abonne of this.abonnes) {
        abonne.gareName = await this.getGareName(abonne.type_zone);
      }
    },


    async fetchGares() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/admin/gares', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.garesData = response.data.Gares.data; // Store garesData in the data property
      } catch (error) {
        console.error(error);
      }
    },


    getGareName(typeZone) {
      const gare = this.garesData.find(g => g.id === typeZone);
      if (gare) {
        return gare.name;
      } else {
        return 'N/A';
      }
    },


    async acceptAbonne(abonne) {
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'active ' }, // Only update the 'etat' field
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'active ';
        }
        this.snackbar = {
          show: true,
          message: 'Abonné accepté avec succès!',
          color: 'success',
        };
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de l\'acceptation de l\'abonné!',
          color: 'error',
        };
      }
    },

    async rejectAbonne(abonne) {
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'refuse' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'refuse';
        }
        this.snackbar = {
          show: true,
          message: 'Abonné refusé avec succès!',
          color: 'success',
        };
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du refus de l\'abonné!',
          color: 'error',
        };
      }
    },
    async printAndMarkAsPrinted(abonne) {
      try {
        // Update the "etat" field to 'imprimer'
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'imprimer' },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          // Remove the printed row from the array
          this.abonnes.splice(index, 1);
        }

        this.snackbar = {
          show: true,
          message: 'Abonné marqué comme imprimé avec succès!',
          color: 'success',
        };

        // Proceed to print the abonne
        this.printAbonne(abonne);
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: "Échec de la mise à jour de l'état de l'abonné!",
          color: 'error',
        };
      }
    },



    async printAbonne(abonne) {
      try {
        // Construire le contenu de l'impression
        const printContent = `
      
   <div style="display: flex; align-items: center;">
    <div style="display: flex; flex-direction: column; align-items: center; width: 120px; height: 150px; margin-right: 10px;">
        <div style="font-size: 18px; margin-bottom: 5px; color: green;">2024/2023</div>
        <div style="font-size: 18px; direction: rtl;">
           <span>${abonne.type_periode} ${abonne.type_inscrit}</span>
        </div>
        <div style="width: 100px; height: 100%; overflow: hidden; background-color: transparent;">
            <img src="https://api.srtk.com.tn/${abonne.src}" alt="Image d'abonné" style="width: auto; height: 100%; object-fit: cover;">
        </div>
        <div style="font-size: 18px; font-weight: bold;">${abonne.code}</div>
    </div>
    
    <div style="display: flex;  flex-direction: column; justify-content: center; margin-left: 30px;">
        <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px; text-align: center;">إشتراك مدرسي حضري</div>
        <div style="margin-top: 5px; font-size: 18px; text-align: center;">${abonne.prenom}</div>
        <div style="margin-top: 5px; font-size: 18px; text-align: center;">${abonne.type_institut}</div>
        <div style="margin-top: 5px; font-size: 18px; text-align: center;"><span>${abonne.cin}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span>${abonne.type_eleve}</span></div>
    </div>
</div>


    `;

        // Ouvrir une nouvelle fenêtre pour l'impression
        const newWindow = window.open('', '_blank');
        newWindow.document.write(printContent);
        newWindow.document.close();

        // Attendre un peu de temps pour que le contenu soit chargé, puis imprimer
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
        }, 1000); // Attendre 1 seconde avant d'imprimer
      } catch (error) {
        console.error('Erreur lors de l\'impression de l\'abonné', error);
      }
    },



    async async(search = false) {
      const axios = useNuxtApp().$axios;

      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      let url = `/admin/abonnes_ord?page=${this.currentPage}`;

      if (search) {
        url += `&search=${this.searchTerm}`; // Append the search term to the URL
      }
      let g = 0;

      g = window.localStorage.getItem('gare_id');
      //console.log("user", g);
      if (g == 'null') {
        g = '';
        ////console.log("hello",g);
      }

      axios
        .get(`/admin/abonnes_ord?page=${this.currentPage}&search=${this.searchTerm}&gare_id=${g}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((res) => {

          this.totalItems = res.data.abonnes.total;
          this.abonnes = res.data.abonnes.data.data;
          //  //console.log('chokri');

          this.isReady = true;
          this.editDialog = false;
        })
        .catch((err) => {
          this.isReady = true;
          this.editDialog = false;
        });
    },
    clearSearch() {
      this.searchTerm = ''; // Clear the search term
      this.async(); // Fetch the initial data
    },

    searchabonnes() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true); // Pass true to indicate a search request
      } else {
        this.clearSearch(); // Call the clearSearch method
      }
    },
    editabonne(abonne) {
      this.editedabonne = {
        id: abonne.id,
        prenom: abonne.prenom,
        adresse: abonne.adresse,
        profession: abonne.profession,
        num_telephone: abonne.num_telephone,
        code: abonne.code,
        cin: abonne.cin,
        date_naissance: abonne.date_naissance,


      };

      this.editDialog = true;
    },
    async updateabonneDetails() {
      const payload = {
        prenom_fr: this.editedabonne.prenom,
        prenom_ar: this.editedabonne.prenom,
        prenom_en: this.editedabonne.prenom,
        adresse_fr: this.editedabonne.adresse,
        adresse_ar: this.editedabonne.adresse,
        adresse_en: this.editedabonne.adresse,
        profession_fr: this.editedabonne.profession,
        profession_ar: this.editedabonne.profession,
        profession_en: this.editedabonne.profession,
        num_telephone: this.editedabonne.num_telephone,
        date_naissance: this.editedabonne.date_naissance,
        code: this.editedabonne.code,
        cin: this.editedabonne.cin,
        Etablissement_id: 1,
        active: true,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/update/${this.editedabonne.id}`,
          payload,
          { headers }
        );
        const index = this.abonnes.findIndex((item) => item.id === this.editedabonne.id);
        if (index !== -1) {
          this.abonnes[index] = { ...this.editedabonne };
        }
        this.snackbar = {
          show: true,
          message: 'abonne modifiée avec succès!',
          color: 'success',
        };
        this.editDialog = false;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la abonne!',
          color: 'error',
        };
      }
    },
    closeEditDialog() {
      this.editDialog = false;
    },

  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedabonnes() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const filteredabonnes = this.abonnes.filter((item) =>
        item.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filteredabonnes.slice(startIndex, endIndex);
    },
  },
};
</script>

<style>
.dialog-header {
  background-color: #eee;
  padding: 16px;
}

.bold-header {
  font-weight: bold;
  color: #a13214;
  /* Use any gray color code or prenom you prefer */
}

.dialog-title {
  font-size: 30px;
  color: #05831c;
  position: -ms-page;
}

.add-abonnes-btn {
  width: 900px;
  /* Adjust the width to your desired value */
}

/* Add vertical lines between table cells */
.v-table th,
.v-table td {
  border-right: 1px solid #ccc;
  padding: 8px;
}

/* Remove right border from the last cell in each row */
.v-table tr td:last-child,
.v-table tr th:last-child {
  border-right: none;
}

/* Add vertical lines between table cells */
.v-table th,
.v-table td {
  border-right: 1px solid #ccc;
  padding: 8px;
}

/* Remove right border from the last cell in each row */
.v-table tr td:last-child,
.v-table tr th:last-child {
  border-right: none;
}

/* Make horizontal lines transparent */
.v-table tbody tr {
  border-bottom: 1px solid transparent;
}

/* Change the background color of alternating rows */
.v-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
  /* Adjust the color as needed */
}
</style>