<template>
  <div>
    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher" append-inner-icon="mdi-magnify"
            single-line hide-details v-model="searchTerm" @click:append-inner="searchAbonnes"
            @click:append-outer="clearSearch"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="480" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">Prénom</th>
          <th class="text-center text-uppercase">Adresse</th>
          <th class="text-center text-uppercase">Profession</th>
          <th class="text-center text-uppercase">État</th>
          <th class="text-center text-uppercase">Code</th>
          <th class="text-center text-uppercase">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedAbonnes" :key="item.id">
          <td>{{ item.prenom }}</td>
          <td class="text-center">{{ item.adresse }}</td>
          <td class="text-center">{{ item.profession }}</td>

          <td class="text-center">{{ item.code }}</td>
          <td class="text-center">{{ item.etat }}</td>
          <td class="text-center"><a :href="`https://srtk.com.tn/imprimerabonnes?code=${item.code}`"
              target="blank"><v-btn>imprimer
                reçue</v-btn></a></td>
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
import { useAdminStore } from '@/store/auth';
definePageMeta({
  layout: 'parent',
})
export default {
  data() {
    return {
      currentPage: 1,
      perPage: 7,
      totalItems: 0,
      abonnes: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedUser: null,
      cin: '', // Add the 'cin' property to store the logged-in user's 'cin'
    };
  },
  created() {
    const adminStore = useAdminStore();
    this.cin = adminStore.cin;

    this.retrieveCinFromLocalStorage(); // Retrieve 'cin' from local storage

    if (!this.cin) {
      // Redirect or handle the case when 'cin' is empty
    } else {
      this.saveCinToLocalStorage(); // Save 'cin' to local storage
      this.async();
    }
  },
  methods: {
    async async(search = false) {
      if (!this.cin) {
        // Redirect or handle the case when 'cin' is empty
        return;
      }
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,
      });

      try {
        const response = await axios.get('/admin/listabn', {
          params: {
            page: this.currentPage,
            search: search ? this.searchTerm : null,
            cin: this.cin,
            type: 'oridnaire'
          },
          headers: { Authorization: `Bearer ${token.value}` },
        });
        this.totalItems = response.data.abonnes.total;
        this.abonnes = response.data.abonnes.data.data;
        this.isReady = true;

        this.saveDataToLocalStorage(); // Save the fetched data to local storage
      } catch (error) {
        this.isReady = true;
      }
    },
    ssaveDataToLocalStorage() {
      if (process.client) {
        const data = {
          totalItems: this.totalItems,
          abonnes: this.abonnes,
        };
        window.localStorage.setItem('abonnesData', JSON.stringify(data));
      }
    },
    clearSearch() {
      this.searchTerm = ''; // Clear the search term
      this.async(); // Fetch data again to reset the table
    },
    saveCinToLocalStorage() {
      if (process.client) {
        window.localStorage.setItem('cin', this.cin);
      }
    },
    retrieveCinFromLocalStorage() {
      if (process.client) {
        this.cin = window.localStorage.getItem('cin') || '';
      }
    },
    retrieveDataFromLocalStorage() {
      if (!this.cin) {
        return; // Skip retrieving data from local storage if cin is empty
      }

      if (process.client) {
        const data = window.localStorage.getItem('abonnesData');
        if (data) {
          const parsedData = JSON.parse(data);
          this.totalItems = parsedData.totalItems;
          this.abonnes = parsedData.abonnes;
        }
      }
    },



  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedAbonnes() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const filteredAbonnes = this.abonnes.filter((item) => {
        const itemCin = item.cin || '';
        const itemPrenom = item.prenom || '';
        return (
          itemCin === this.cin &&
          itemPrenom.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      const paginatedData = filteredAbonnes.slice(startIndex, endIndex);
      return paginatedData;
    },
  },
};

</script>








<style>
.dialog-header {
  background-color: #eee;
  padding: 16px;
}

.dialog-title {
  font-size: 30px;
  color: #05831c;
  position: -ms-page;
}
</style>
