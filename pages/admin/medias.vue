<template>
  <div>
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" position>
      {{ snackbar.message }}
    </VSnackbar>
    <v-dialog v-model="editDialog" max-width="900px" content-class="dialog-content">
      <v-card>
        <v-card-text class="dialog-header">
          <span class="dialog-title">Update Images</span>
        </v-card-text>
        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedMedia.src" label="src" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateMediaDetails">Update</v-btn>
          <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="mb-2">
      <v-row class="p-4 justify-end">
        <v-col cols="3">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher Media"
            append-inner-icon="mdi-magnify" single-line hide-details v-model="searchTerm"
            @click:append-inner="searchmedias"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn size="large" color="secondary" @click="navigateToPage">Ajouter Media</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-table height="480" fixed-header>
      <thead>
        <tr>
          <th class="text-uppercase">SRC</th>
          <th class="text-uppercase" style="text-align: center;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedmedias" :key="item.id">
          <td>
            <v-img class="bg-white" width="150" :aspect-ratio="1" :src="`https://api.srtk.com.tn/${item.path}`"></v-img>
          </td>
          <td class="text-center">
            <v-btn variant="text" color="green" fab small @click="editMedia(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn variant="text" color="green" fab small @click="deleteMedia(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="text-center">
      <v-paginatio v-if="totalPages > 0" v-model="currentPage" :length="totalPages" @input="updatePage"
        prev-icon="mdi-chevron-left" next-icon="mdi-chevron-right" color="red"></v-paginatio>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueScrollTo from 'vue-scrollto';

export default {
  data() {
    return {
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 5,
      totalItems: 0,
      medias: [],
      searchTerm: '',
      isLoading: false,
      editDialog: false,
      editedMedia: {
        id: null,
        src: '',
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
      let url = `/admin/medias?page=${this.currentPage}`;
      if (search) {
        url += `&search=${this.searchTerm}`;
      }
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token.value}` },
        })
        .then((res) => {
          this.totalItems = res.data.media.total;
          this.medias = res.data.media;
          this.isReady = true;
          this.editDialog = false;
        })
        .catch((err) => {
          this.isReady = true;
          this.editDialog = false;
        });
    },
    clearSearch() {
      this.searchTerm = '';
      this.async();
    },
    navigateToPage(media) {
      this.selectedMedia = media;
      this.$router.push({ path: '/admin/media', query: { id: media.id } });
    },
    searchmedias() {
      if (this.searchTerm !== null && this.searchTerm.trim() !== '') {
        this.async(true);
      } else {
        this.clearSearch();
      }
    },
    editMedia(media) {
      this.editedMedia = {
        id: media.id,
        src: media.src,
      };
      this.editDialog = true;
    },
    async updateMediaDetails() {
      const payload = {
        src: this.editedMedia.src,
        active: true,
      };
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/media/update/${this.editedMedia.id}`,
          payload,
          { headers }
        );
        const index = this.medias.findIndex((item) => item.id === this.editedMedia.id);
        if (index !== -1) {
          this.medias[index] = { ...this.editedMedia };
        }
        this.snackbar = {
          show: true,
          message: 'Media modifiée avec succès!',
          color: 'success',
        };
        this.editDialog = false;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la modification de la Media!',
          color: 'error',
        };
      }
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    async deleteMedia(media) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
        if (confirmed) {
          await axios.delete(`https://api.srtk.com.tn/api/admin/media/${media.id}`, { headers });
          const index = this.medias.findIndex((item) => item.id === media.id);
          if (index !== -1) {
            this.medias.splice(index, 1);
          }
          this.snackbar = {
            show: true,
            message: 'media  supprimée avec succès!',
            color: 'success',
          };
        }
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec de la suppression de la Media!',
          color: 'error',
        };
      }
    },
    async updatePage(page) {
      this.currentPage = page;
      await this.async();
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    paginatedmedias() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const paginatedData = this.medias.slice(startIndex, endIndex);
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
