<template>
  <div>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>
        <v-card-text class="dialog-header text-center" color="green">
          <span class="dialog-title"> Modifier </span>
        </v-card-text>

        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedstock.code_debut" label="Code début"></v-text-field>
                <v-text-field v-model="editedstock.code_fin" label="Code fin"></v-text-field>
                <v-text-field v-model="editedstock.code_actuel" label="Code actuel"></v-text-field>


                <select v-model="editedstock.selectedUser.id" @change="updateSelectedUser">

                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>


              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updatestockDetails">Update</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher " append-inner-icon="mdi-magnify"
            single-line hide-details v-model="searchTerm" @click:append-inner="searchstocks"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn size="large" color="secondary" @click="navigateToPage">
            Ajouter
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer cet élément ?
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="deleteConfirmed">Oui</v-btn>
          <v-btn text @click="cancelDelete">Non</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-table class="table" height="480" fixed-header>
      <thead>
        <tr class="table-header">
          <th class="text-uppercase table-cell">code e debut</th>
          <th class="text-center text-uppercase table-cell">Code fin</th>
          <th class="text-center text-uppercase table-cell">code actuel</th>
          <th class="text-center text-uppercase table-cell">utilisateur</th>
          <th class="text-center text-uppercase table-cell">date de création </th>
          <th class="text-center text-uppercase table-cell">date de modification </th>
          <th class="text-center text-uppercase table-cell">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedstocks" :key="item.id" class="table-row">
          <td class="table-cell">{{ item.code_debut }}</td>
          <td class="text-center table-cell">{{ item.code_fin }}</td>
          <td class="text-center table-cell">{{ item.code_actuel }}</td>
          <td class="text-center table-cell">{{ item.user_name }}</td>
          <td class="text-center table-cell">{{ formatDate(item.created_at) }}</td>
          <td class="text-center table-cell">{{ formatDate(item.updated_at) }}</td>

          <td class="text-center table-cell">
            <v-btn variant="text" color="green" fab small @click="editstock(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn variant="text" color="green" fab small @click="confirmDelete(item)">
              <v-icon>mdi-delete</v-icon>
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
import VueScrollTo from 'vue-scrollto';

definePageMeta({
  layout: "admin",
});
export default {
  data() {
    return {

      confirmDeleteDialog: false,
      currentPage: 1,
      perPage: 15,
      totalItems: 0,
      stocks: [],
      users: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedstock: null,
      editDialog: false,
      editedstock: {
        selectedUser: {
          id: null,
        },
        code_actuel: '',
        code_debut: '',
        code_fin: '',
        created_at: '',
        selectedUser: null, // Ajoutez cette ligne
      },
    };
  },
  created() {
    this.async();
    this.editDialog = false;
    // Chargez la liste des utilisateurs lors de la création du composant
    this.loadUsers();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },

  methods: {
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const date = new Date(dateString);
      return date.toLocaleString('fr-TN', options);
    },

    updateSelectedUser() {
      // Mettre à jour editedstock.selectedUser avec la nouvelle valeur sélectionnée
      const selectedUserId = this.editedstock.selectedUser.id;
      const selectedUser = this.users.find((user) => user.id === selectedUserId);
      this.editedstock.selectedUser = selectedUser;
    },
    //
    deleteConfirmed() {
      // Effectuez la suppression de l'élément ici
      if (this.selectedstock) {
        this.deletestock(this.selectedstock); // Appel de votre méthode de suppression
        this.selectedstock = null; // Réinitialisez la variable temporaire
      }
      this.confirmDeleteDialog = false; // Fermez la boîte de dialogue de confirmation
    },
    cancelDelete() {
      this.selectedstock = null; // Réinitialisez la variable temporaire
      this.confirmDeleteDialog = false; // Fermez la boîte de dialogue de confirmation
    },
    //
    confirmDelete(item) {
      this.selectedstock = item; // Stockez l'élément à supprimer dans une variable temporaire
      this.confirmDeleteDialog = true; // Affichez la boîte de dialogue de confirmation
    },
    async loadUsers() {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,
      });

      try {
        const response = await axios.get('/admin/users', {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        this.users = Array.isArray(response.data.users.data) ? response.data.users.data : [];
      } catch (error) {
        console.error("Error loading users:", error);
        // Gérez les erreurs de chargement des utilisateurs ici
      }
      //console.log(this.users)
    },







    async async(search = false) {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,
      });

      // Charger les stocks
      let url = `/admin/stocks?page=${this.currentPage}`;
      if (search) {
        url += `&search=${this.searchTerm}`;
      }
      const stocksResponse = await axios.get(url, {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      // Charger les utilisateurs
      const usersResponse = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${token.value}` },
      });

      // Mettre à jour la liste des utilisateurs
      this.users = Array.isArray(usersResponse.data.users.data) ? usersResponse.data.users.data : [];
      //  console.log(this.users)


      this.totalItems = stocksResponse.data.stocks.total;
      this.stocks = stocksResponse.data.stocks.data.map((stock) => {
        //  console.log(this.stocks)
        // Trouver l'utilisateur correspondant par ID
        const user = this.users.find((user) => user.id === stock.user_id);
        // Ajouter le nom de l'utilisateur au stock
        return {
          ...stock,
          user_name: user ? user.name : '', // Stockez le nom de l'utilisateur ou une chaîne vide si l'utilisateur n'est pas trouvé
        };
      });

      this.isReady = true;
      this.editDialog = false;
    },


    clearSearch() {
      this.searchTerm = ''; // Clear the search term
      this.async(); // Fetch the initial data
    },
    navigateToPage(stock) {
      this.selectedstock = stock;
      this.$router.push({ path: '/admin/Codebarre', query: { id: stock.id } });
    },
    searchstocks() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true); // Pass true to indicate a search request
      } else {
        this.clearSearch(); // Call the clearSearch method
      }
    },
    editstock(stock) {
      // Préremplir les champs du formulaire avec les données du stock
      const selectedUser = this.users.find((user) => user.id === stock.user_id);

      this.editedstock = {
        id: stock.id,
        code_debut: stock.code_debut,
        code_fin: stock.code_fin,
        code_actuel: stock.code_actuel,

        user_id: stock.user_id,
        selectedUser: selectedUser || null, // Initialisez selectedUser avec les données de l'utilisateur ou null
      };

      // Affichez la boîte de dialogue de modification
      this.editDialog = true;
    },


    updatestockDetails() {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      this.async(this.searchTerm !== '');
      const updatestockUrl = `https://api.srtk.com.tn/api/admin/stock/update/${this.editedstock.id}`;

      axios
        .put(updatestockUrl, { code_debut: this.editedstock.code_debut, code_fin: this.editedstock.code_fin, code_actuel: this.editedstock.code_actuel, updated_at: this.editedstock.updated_at, user_id: this.editedstock.selectedUser.id, }, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((response) => {
          // Mise à jour réussie, mettez à jour updated_at dans this.editedstock
          this.editedstock.updated_at = response.data.updated_at; // Mettez à jour la valeur de updated_at
          //console.log("stock updated successfully:", response.data);
          // Perform any additional actions after successful stock update
          // this.editedstock.user_id = response.data.updated_user_id; // Assurez-vous de la clé correcte dans la réponse de l'API
          // Close the edit dialog
          this.editDialog = false;

          // Refresh the stock list
          this.async();
        })
        .catch((error) => {
          console.error("Error updating stock:", error);
          // Handle error scenario, display error message, etc.
        });
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    deletestock(stock) {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,
      });
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.clearSearch(); // Call the clearSearch method
      }
      const deletestockUrl = `https://api.srtk.com.tn/api/admin/stock/${stock.id}`;

      axios
        .delete(deletestockUrl, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then(() => {
          const index = this.stocks.findIndex((u) => u.id === stock.id);
          if (index !== -1) {
            this.stocks.splice(index, 1);
          }
          //console.log("stock deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting stock:", error);
          // Handle error scenario, display error message, etc.
        });
    },
  },
  computed: {
    userOptions() {
      // Transform the users array into the format expected by v-select
      return this.users.map(user => ({
        id: user.id,
        name: user.name,
      }));
    },

    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedstocks() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;

      // Filtrer les stocks en fonction de tous les champs de recherche
      const filteredstocks = this.stocks.filter((item) => {
        const searchTermLower = this.searchTerm.toLowerCase();
        return (
          item.code_debut.toLowerCase().includes(searchTermLower) ||
          item.code_fin.toLowerCase().includes(searchTermLower) ||
          item.code_actuel.toLowerCase().includes(searchTermLower) ||
          item.user_name.toLowerCase().includes(searchTermLower) ||
          this.formatDate(item.created_at).toLowerCase().includes(searchTermLower) ||
          this.formatDate(item.updated_at).toLowerCase().includes(searchTermLower)
        );
      });

      return filteredstocks.slice(startIndex, endIndex);
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

/* Style pour la table */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ccc;
  /* Ajoutez une bordure à chaque cellule */
  padding: 8px;
  text-align: center;
}

.table th {
  background-color: #eee;
  font-weight: bold;
}

.table tr:nth-child(even) {
  background-color: #f2f2f2;
  /* Couleur de fond pour les lignes paires */
}

.table tr:hover {
  background-color: #ddd;
  /* Couleur de fond au survol de la ligne */
}
</style>

