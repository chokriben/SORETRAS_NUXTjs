<template>
  <div>
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}

    </VSnackbar>


    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher abonne"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @input="startSearchTimeout"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="690" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">image</th>
          <th class="text-uppercase">Nom</th>
          <th class="text-uppercase">type</th>
          <th class="text-uppercase">adresse</th>
          <th class="text-uppercase">IDENTIFIANT</th>
          <th class="text-uppercase">Type personne</th>
          <th class="text-uppercase">Numero de telphone</th>
          <th class="text-uppercase">cin</th>
          <th class="text-uppercase">etat</th>
          <th class="text-uppercase">Action</th>


        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedabonnes" :key="item.id">
          <td>
            <v-img :aspect-ratio="16 / 9" cover :src="`https://api.srtk.com.tn/${item.src}`"></v-img>
          </td>
          <td>{{ item.prenom }}</td>
          <td>{{ item.type_paiment }}</td>

          <td>{{ item.adresse }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.type_eleve }}</td>
          <td>{{ item.num_telephone }}</td>
          <td>{{ item.cin }}</td>
          <td>{{ item.etat }}</td>






          <td class="text-center">

            <a :href="`https://api.srtk.com.tn/api/imprim_abn?id=${item.id}`" target="blank">
              <v-icon>mdi-printer</v-icon>
            </a>
            <v-btn variant="text" v-if="item.etat !== 'Imprimer ch'" color="red" fab small @click="rejectAbonne(item)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn variant="text" v-if="item.etat === 'Imprimer ch'" color="red" fab small @click="rejectAbonnech(item)">
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

      searchTimeout: null,
      searchTerm: '',
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 12,
      totalItems: 0,
      abonnes: [],

      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedabonne: null,


    };
  },
  async created() {

    this.async();
    this.editDialog = false;
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    async rejectAbonne(abonne) {
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'annuler' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'annuler';
        }
        this.snackbar = {
          show: true,
          message: 'Abonné annuler avec succès!',
          color: 'success',
        };
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec d\'annulation de l\'abonné!',
          color: 'error',
        };
      }
    },
    async rejectAbonnech(abonne) {
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'annuler ch' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'annuler ch';
        }
        this.snackbar = {
          show: true,
          message: 'Abonné annuler avec succès!',
          color: 'success',
        };
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec d\'annulation de l\'abonné!',
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

    startSearchTimeout() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchabonnes(); // Appelez directement searchabonnes ici
      }, 500);
    },

    searchabonnes() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true);
      } else {
        this.clearSearch();
      }
    },
    async(search = false) {
      const axios = useNuxtApp().$axios;
      let url = `/admin/list_abn_imp?page=`;

      if (search) {
        url += `&search=${this.searchTerm}`;
      }
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          this.totalItems = res.data.abonnes.total;
          this.abonnes = res.data.abonnes.data.data;

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
  },

  computed: {
    // Calculate a computed property to filter abonnes based on 'etat'
    filteredAbonnes() {
      return this.abonnes;
    },

    totalPages() {
      return Math.ceil(this.filteredAbonnes.length / this.perPage);
    },

    paginatedabonnes() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredAbonnes.slice(startIndex, endIndex);
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