<template>
  <div dir="rtl">
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}
    </VSnackbar>
 <v-col cols="2">
          <v-btn size="large" color="secondary" @click="navigateToPage" style="width: 900px;">
    Ajouter 
</v-btn>

        </v-col>
    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher Etablissement"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchEtablissements"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="700" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">Etablissement</th>
          <th class="text-uppercase">Code Etab</th>
          <th class="text-uppercase">Type Etablissement</th>
          <th class="text-uppercase">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedEtablissements" :key="item.id">
          <td>{{ item.translations[0].labelle }}</td>
          <td>{{ item.codeetab }}</td>
          <td>{{ item.typeetablissement }}</td>
          <td>
            <input type="checkbox" v-model="item.active" @change="updateActiveStatus(item)">
          </td>
        </tr>

      </tbody>
    </v-table>

    <div class="text-center" dir="ltr">
      <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" @input="fetchEtablissements"
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
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 12,
      totalItems: 0,
      etablissements: [],
      searchTerm: '',
      // snackbar: true, // Remove this line
      isLoading: false,
      isLoadingTitle: 'loading',
    };
  },
  async created() {

    await this.fetchEtablissements();

  },

  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    navigateToPage() {
      
      this.$router.push({ path: '/admin/etablissementss' });
    },
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },

    updateActiveStatus(item) {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,
      });

      // Toggle the 'active' property
      //  item.active = !item.active;

      axios
        .put(`/admin/etablissemnt/update/${item.id}`, { active: item.active }, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then(() => {
          this.showSnackbar('Status updated successfully', 'success');
        })
        .catch((error) => {
          console.error('Error updating status:', error);
          this.showSnackbar('An error occurred while updating status', 'error');
        });
    },

    async fetchEtablissements(search = false) {
      const axios = useNuxtApp().$axios;

      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      let url = `/admin/etablissemnts?page=${this.currentPage}`;

      if (search) {
        url += `&search=${this.searchTerm}`; // Append the search term to the URL
      }
      axios.get(`/admin/etablissemnts?page=${this.currentPage}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })

        .then((res) => {
          this.totalItems = res.data.etablissements.total;
          //  //console.log(this.totalItems)
          this.etablissements = res.data.etablissements.data.data;
          // //console.log(this.etablissements)
        })
        .catch((err) => {
          // ...rest of the code
          //console.log("ggg")
        });
      ////console.log(token.value); // Moved outside of the axios call

    },


    clearSearch() {
      this.searchTerm = '';
      this.async();
    },
    searchEtablissements() {
      if (this.searchTerm.trim() !== '') {
        this.async(true);
      } else {
        this.clearSearch();
      }
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
 paginatedEtablissements() {
  const startIndex = (this.currentPage - 1) * this.perPage;
  const endIndex = startIndex + this.perPage;

  const filteredEtablissements = this.etablissements.filter((item) => {
    const searchTerm = this.searchTerm.toLowerCase();
    return (
      (item.labelle && item.labelle.toLowerCase().includes(searchTerm)) ||
      (item.typeetablissement && item.typeetablissement.toLowerCase().includes(searchTerm)) ||
      (item.codeetab && item.codeetab.toLowerCase().includes(searchTerm)) 
      // Ajoutez d'autres champs ici
    )
  });

  return filteredEtablissements.slice(startIndex, endIndex);
},

  },



};
</script>

<style></style>