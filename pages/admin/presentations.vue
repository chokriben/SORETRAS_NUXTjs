<template>
  <div>
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}

    </VSnackbar>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>

        <v-card-text class="dialog-header">
          <span class="dialog-title">Update Presentation</span>
        </v-card-text>
        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedPresentation.name" label="Name" required></v-text-field>

                <v-text-field v-model="editedPresentation.description" label="Description" required></v-text-field>
                <v-file-input v-model="editedFile" :value="editedFile" label="File" accept="image/*"
                  @change="onFileChangeEdit"></v-file-input>

                <!-- Display the selected file -->
                <img v-if="editedPresentation.selectedFile" :src="editedPresentation.selectedFile" alt="Selected File" />
                <span v-else>No file available</span>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updatePresentationDetails">Update</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher Presentation"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchPresentations"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn size="large" color="secondary" @click="navigateToPage">
            Ajouter
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="480" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">page</th>
          <th class="text-uppercase">Description</th>
          <th class="text-uppercase">Fichier</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedPresentations" :key="item.id">
          <td>{{ item.name }}</td>
          <td>
            <div class="content" v-html="item.description"></div>
          </td>
          <td>
            <!-- Display the file for each presentation -->
            <img v-if="presentationMedia[item.id]" :src="presentationMedia[item.id]" alt="Selected File" />
            <span v-else>No file available</span>
          </td>


          <td class="text-center">

            <v-btn variant="text" color="green" fab small @click="editPresentation(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn variant="text" color="green" fab small @click="deletePresentation(item)">
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
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
definePageMeta({
  layout: "admin",
});
export default {
  data() {
    return {
      file: null,
      selectedFile: null,
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 7,
      totalItems: 0,
      Presentations: [],
      presentationMedia: {},
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedPresentation: null,
      editDialog: false,
      editedPresentation: {
        id: null,
        name: '',
        description: ','

      },
    };
  },
  created() {
    this.async();
    this.editDialog = false;
    this.fetchMediaData();

  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    async fetchMediaData() {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      //console.log("lllll")
      for (const presentation of this.Presentations) {
        try {
          // Update the URL to use '/api/admin/medias' instead of '/api/admin/media'
          const mediaResponse = await axios.get(`https://api.srtk.com.tn/api/admin/medias?legende=presentations&media_id=${presentation.id}`, { headers });
          const mediaData = mediaResponse.data.data; // Remove '.data' since 'mediaResponse.data' is already the data array
          //console.log(`Media data for presentation with id ${presentation.id}:`, mediaData);
          //console.log("kkk")

          if (mediaData && mediaData.length > 0) {
            // Assuming we have only one media per presentation (you can change this if necessary)
            this.presentationMedia[presentation.id] = '/storage/' + mediaData[0].src;
          } else {
            // No media found for the presentation, set to null
            this.presentationMedia[presentation.id] = null;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },







    async async(search = false) {
      const axios = useNuxtApp().$axios;

      const token = useCookie('token', {
        watch: true,
        HttpOnly: true,

      });
      let url = `/admin/presentations?page=${this.currentPage}`;

      if (search) {
        url += `&search=${this.searchTerm}`; // Append the search term to the URL
      }
      axios
        .get(`/admin/presentations?page=${this.currentPage}&search=${this.searchTerm}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((res) => {
          this.totalItems = res.data.Presentations.total;
          this.Presentations = res.data.Presentations.data.data;
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
    navigateToPage(Presentation) {
      this.selectedPresentation = Presentation;
      this.$router.push({ path: '/admin/presentation', query: { id: Presentation.id } });
    },
    searchPresentations() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true); // Pass true to indicate a search request
      } else {
        this.clearSearch(); // Call the clearSearch method
      }
    },
    editPresentation(Presentation) {
      this.editedPresentation = {
        id: Presentation.id,
        name: Presentation.name,
        description: Presentation.description,
        selectedFile: Presentation.selectedFile,
      };
      this.editedFile = null;
      this.editDialog = true;
    },
    onFileChangeEdit(event) {
      // Get the selected file from the event
      this.editedFile = event.target.files[0];

      // Display the selected file
      if (this.editedFile) {
        this.editedPresentation.selectedFile = URL.createObjectURL(this.editedFile);
      } else {
        this.editedPresentation.selectedFile = null;
      }
    },
    async updatePresentationDetails() {
      const payload = {
        name_fr: this.editedPresentation.name, // Fixed: Use editedPresentation instead of editPresentation
        name_ar: this.editedPresentation.name, // Fixed: Use editedPresentation instead of editPresentation
        name_en: this.editedPresentation.name, // Fixed: Use editedPresentation instead of editPresentation
        description_fr: this.editedPresentation.description, // Fixed: Use editedPresentation instead of editPresentation
        description_ar: this.editedPresentation.description, // Fixed: Use editedPresentation instead of editPresentation
        description_en: this.editedPresentation.description,
        file: this.editedFile,
        active: true,
      };
      // Check if the file has changed and add it to the payload
      if (this.editedPresentation.file) {
        payload.file = this.editedPresentation.file;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/presentation/update/${this.editedPresentation.id}`,
          payload,
          { headers }
        );
        const index = this.Presentations.findIndex((item) => item.id === this.editedPresentation.id);
        if (index !== -1) {
          this.Presentations[index] = { ...this.editedPresentation };
        }
        this.snackbar = {
          show: true,
          message: 'Presentation modifiée avec succès!',
          color: 'success',
        };
        this.editDialog = false;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Presentation!',
          color: 'error',
        };
      }
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    async deletePresentation(Presentation) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/presentation/${Presentation.id}`, { headers });
          // Remove the deleted item from the array
          const index = this.Presentations.findIndex((item) => item.id === Presentation.id);
          if (index !== -1) {
            this.Presentations.splice(index, 1);
          }
          this.snackbar = {
            show: true,
            message: 'Presentation  supprimée avec succès!',
            color: 'success',
          };

        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Presentation!',
          color: 'error',
        };
      }
    },



  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedPresentations() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const filteredPresentations = this.Presentations.filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      return filteredPresentations.slice(startIndex, endIndex);
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