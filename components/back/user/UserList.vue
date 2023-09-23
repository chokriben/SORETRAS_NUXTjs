<template>
  <div>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>
        <v-card-text class="dialog-header">
          <span class="dialog-title">Update Admin</span>
        </v-card-text>
        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedUser.name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedUser.password" label="Password"></v-text-field>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateUserDetails">Update</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher Admin"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchUsers"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn size="large" color="secondary" @click="navigateToPage">
            Ajouter Admin
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="480" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">Nom</th>
          <th class="text-center text-uppercase">Email</th>
          <th class="text-center text-uppercase">Role</th>
          <th class="text-center text-uppercase">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedUsers" :key="item.id">
          <td>{{ item.name }}</td>
          <td class="text-center">{{ item.email }}</td>
          <td class="text-center">Admin</td>
          <td class="text-center">
            <v-btn variant="text" color="green" fab small @click="editUser(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn variant="text" color="green" fab small @click="deleteUser(item)">
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
export default {
  data() {
    return {
      currentPage: 1,
      perPage: 7,
      totalItems: 0,
      users: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedUser: null,
      editDialog: false,
      editedUser: {
        id: null,
        name: '',
        email: '',

      },
    };
  },
  created() {
    this.async();
    this.editDialog = false;

  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    async async(search = false) {
      const axios = useNuxtApp().$axios;

      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      let url = `/admin/users?page=${this.currentPage}`;

      if (search) {
        url += `&search=${this.searchTerm}`; // Append the search term to the URL
      }
      axios
        .get(`/admin/users?page=${this.currentPage}&search=${this.searchTerm}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((res) => {
          this.totalItems = res.data.users.total;
          this.users = res.data.users.data.data;
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
    navigateToPage(user) {
      this.selectedUser = user;
      this.$router.push({ path: '/admin/adminAdd', query: { id: user.id } });
    },
    searchUsers() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true); // Pass true to indicate a search request
      } else {
        this.clearSearch(); // Call the clearSearch method
      }
    },
    editUser(user) {
      this.editedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,

      };

      this.editDialog = true;
    },
    updateUserDetails() {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      this.async(this.searchTerm !== '');
      const updateUserUrl = `https://api.srtk.com.tn/api/admin/user/update/${this.editedUser.id}`;

      axios
        .put(updateUserUrl, { name: this.editedUser.name, email: this.editedUser.email, password: this.editedUser.password }, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((response) => {
          //console.log("User updated successfully:", response.data);
          // Perform any additional actions after successful user update

          // Close the edit dialog
          this.editDialog = false;

          // Refresh the user list
          this.async();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          // Handle error scenario, display error message, etc.
        });
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    deleteUser(user) {
      const axios = useNuxtApp().$axios;
      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,
      });
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.clearSearch(); // Call the clearSearch method
      }
      const deleteUserUrl = `https://api.srtk.com.tn/api/admin/user/${user.id}`;

      axios
        .delete(deleteUserUrl, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then(() => {
          const index = this.users.findIndex((u) => u.id === user.id);
          if (index !== -1) {
            this.users.splice(index, 1);
          }
          //console.log("User deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          // Handle error scenario, display error message, etc.
        });
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const filteredUsers = this.users.filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filteredUsers.slice(startIndex, endIndex);
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