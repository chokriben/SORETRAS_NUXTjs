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

    <v-dialog v-model="printDialog" max-width="900px" content-class="dialog-content">
      <v-card>

        <v-card-text class="dialog-header">
          <span class="dialog-title">Abonnement form</span>
        </v-card-text>

        <v-card-text class="dialog-body">
          <v-container fluid>
            <v-row>
              <iframe width="100%" height="700" src="https://api.srtk.com.tn/api/t" frameborder="0"
                allowfullscreen></iframe>

            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="secondary" @click="closeprintDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div>
      <div v-for="stock in stocks" :key="stock.id">
        <table>
          <tr>
            <td>Code de début: {{ stock.code_debut }}</td>
            <td>Code de fin: {{ stock.code_fin }}</td>
            <td>Code courant: {{ stock.code_actuel }}</td>
            <td>Reste: {{ stock.code_actuel - stock.code_fin }}</td>
          </tr>
        </table>

      </div>
    </div>
    <v-card class="mb-2">
      <v-row class="p-4 justify-end">

        <v-col cols="9">
          <v-btn variant="text" class="btn primary" color="green" fab small @click="printabonne()">
            <v-icon>mdi-printer</v-icon> Imprimer par Lot
          </v-btn>
        </v-col>

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
          <th class="text-uppercase">Numero de telphone</th>
          <th class="text-uppercase">Date creation</th>
          <th class="text-uppercase">cin</th>
          <th class="text-uppercase">etat</th>
          <th class="text-uppercase">action</th>


        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedabonnes" :key="item.id">
          <td v-if="item.etat !== 'imprimer'">
            <v-img :aspect-ratio="16 / 9" :src="`https://api.srtk.com.tn/${item.src}`"></v-img>
          </td>
          <td v-if="item.etat !== 'imprimer'">{{ item.prenom }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.type_paiment }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.adresse }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.code }}</td>

          <td v-if="item.etat !== 'imprimer'">{{ getGareName(item.type_zone) || 'N/A' }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.num_telephone }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.created_at }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.cin }}</td>
          <td v-if="item.etat !== 'imprimer'">{{ item.etat }}</td>







          <td class="text-center" v-if="item.etat !== 'imprimer'">
            <v-btn variant="text" color="green" fab small @click="editabonne(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn variant="text" color="green" v-if="item.etat !== 'paye ch'" fab small @click="imprintAbonne(item)">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-btn variant="text" color="green" v-if="item.etat === 'paye ch'" fab small @click="imprintAbonnech(item)">
              <v-icon>mdi-printer </v-icon>
            </v-btn>
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
      filterByPhoneNumber: '',
      filteredabonnes: [],
      gareNames: {},
      gares: [], // Add this line to store gares data
      currentPage: 1,
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
      perPage: 9,
      totalItems: 0,
      abonnes: [],
      searchTerm: '',
      snackbar: true,
      isLoading: false,
      isLoadingTitle: 'loading',
      selectedabonne: null,
      editDialog: false,
      printDialog: false,
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
    this.printDialog = false;
  },
  mounted() {
    this.fetchGares(); // Call fetchGares when the component is mounted
    this.loadStocks();
    this.fetchUserId();
  },
  directives: {
    ScrollTo: VueScrollTo.directive,
  },
  methods: {
    //chokri--------------------
    generateCodeSequence() {
      // Boucle à travers les stocks
      for (const stock of this.stocks) {
        // Assurez-vous que le code de début est inférieur ou égal au code de fin
        if (stock.code_debut <= stock.code_fin) {
          // Imprimez chaque code de début jusqu'au code de fin
          for (let i = stock.code_debut; i <= stock.code_fin; i++) {
            console.log(`Code généré: ${i}`);
            // Vous pouvez envoyer chaque code généré à l'imprimante ici
          }
        } else {
          console.error("Le code de début est supérieur au code de fin.");
        }
      }
    },

    //chokri--------------------
    async loadStocks() {
      const axios = useNuxtApp().$axios;
      const token = useCookie("token", {
        watch: true,
        HttpOnly: true,
      });

      // Appeler fetchUserId() pour obtenir la valeur de userId
      this.fetchUserId();

      try {
        const response = await axios.get("/admin/stocks", {
          headers: { Authorization: `Bearer ${token.value}` },
        });

        // Vérifiez le contenu de la réponse de la requête
        // console.log("Response data:", response.data);
        const userI = parseInt(this.userId, 10); // Convertir this.userId en nombre

        // Filtrer les stocks par user_id
        const filteredStocks = Array.isArray(response.data.stocks.data)
          ? response.data.stocks.data.filter((stock) => stock.user_id === userI)
          : [];

        // Vérifiez le contenu de filteredStocks
        // console.log("Filtered stocks:", filteredStocks);

        if (filteredStocks.length > 0) {
          // Trouver le stock avec la date de création la plus récente
          const latestStock = filteredStocks.reduce((prev, current) =>
            new Date(current.created_at) > new Date(prev.created_at)
              ? current
              : prev
          );

          // Maintenant, latestStock contient le stock avec la date de création la plus récente
          this.stocks = [latestStock];

          // console.log("Latest stock:", this.stocks);
        } else {
          // Le tableau est vide, vous pouvez gérer ce cas comme vous le souhaitez
          console.log("Aucun stock trouvé pour l'utilisateur.");
          this.stocks = []; // Vous pouvez également affecter un tableau vide à this.stocks
        }
      } catch (error) {
        console.error("Error loading stocks:", error);
        // Gérez les erreurs de chargement des stocks ici
      }
    },

    //stock chokri
    fetchUserId() {
      this.userId = localStorage.getItem("userId");
    },

    //stock chokri

    async loadGareNamesForAbonnes() {
      for (const abonne of this.abonnes) {
        if (abonne.type_zone === 1) {
          const gare = this.gares.find(g => g.id === abonne.type_zone);
          if (gare) {
            abonne.gareName = gare.name;
            //console.log(`Abonne ID: ${abonne.id}, Type Zone: ${abonne.type_zone}, Gare Name: ${gare.name}`);
          } else {
            abonne.gareName = 'N/A';
          }
        } else {
          abonne.gareName = 'N/A';
        }
      }
    },
    filterAbonnes(abonnesData) {
      return abonnesData.filter((item) =>
        item.type_zone.includes(this.searchTerm)
      );
    },
    async printFilteredAbonnes() {
      const filteredAbonnes = this.paginatedabonnes; // Utilisez les abonnés filtrés
      for (const abonne of filteredAbonnes) {
        await this.printAbonne(abonne);
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

    async imprintAbonnech(abonne) {
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'Imprimer ch' }, // Only update the 'etat' field
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'Imprimer ch';
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
    async imprintAbonne(abonne) {
      try {
        await axios.put(
          `https://api.srtk.com.tn/api/admin/abonne/updateEtat/${abonne.translations[0].abonne_id}`,
          { etat: 'Imprimer ' }, // Only update the 'etat' field
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'Imprimer ';
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
          { etat: 'refuser' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const index = this.abonnes.findIndex((item) => item.id === abonne.id);
        if (index !== -1) {
          this.abonnes[index].etat = 'refuser';
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

    async printFilteredAbonnes() {
      const filteredAbonnes = this.paginatedabonnes;
      const printContent = filteredAbonnes
        .map((abonne) => this.getFormattedPrintContent(abonne))
        .join('');

      const newWindow = window.open('', '_blank');
      newWindow.document.write(printContent);
      newWindow.document.close();

      setTimeout(() => {
        newWindow.print();
        newWindow.close();
      }, 1000);
    },

    getFormattedPrintContent(abonne) {
      return `
  <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
    <div style="display: flex; flex-direction: column; align-items: center; width: 120px; height: 150px; margin-right: 10px;">
        <div style="font-size: 18px; margin-bottom: 5px; color: green;">2024/2023</div>
        <div style="font-size: 18px; direction: rtl;">
           <span>${abonne.type_periode} ${abonne.type_inscrit}</span>
        </div>
        <div style="width: 100px; height: 100%; overflow: hidden; background-color: transparent;">
            <img src="https://api.srtk.com.tn/api/${abonne.src}" alt="Image d'abonné" style="width: auto; height: 100%; object-fit: cover;">
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
            <img src="https://api.srtk.com.tn/api/${abonne.src}" alt="Image d'abonné" style="width: auto; height: 100%; object-fit: cover;">
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
      let url = `/admin/list_abn?page=${this.currentPage}`;

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
        .get(`/admin/list_abn?page=${this.currentPage}&search=${this.searchTerm}&gare_id=${g}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        })

        .then((res) => {

          this.totalItems = res.data.abonnes.total;
          this.abonnes = res.data.abonnes.data.data;
          ////console.log(this.abonnes)
          this.abonnes = abonnesData;
          this.filteredabonnes = this.filterAbonnes(abonnesData);
          this.filteredabonnes = this.filterAbonnesByEtat(abonnesData);
          this.loadGareNamesForAbonnes();
          this.isReady = true;
          this.editDialog = false;
          this.printDialog = false;

        })
        .catch((err) => {
          this.isReady = true;
          this.editDialog = false;
          this.printDialog = false;

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
    printabonne() {


      this.printDialog = true;
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
    closeprintDialog() {
      this.printDialog = false;
    },

  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    uniquePhoneNumbers() {
      // Obtenir une liste unique de numéros de téléphone à partir des abonnés
      const phoneNumbers = this.abonnes.map((abonne) => abonne.num_telephone);
      return [...new Set(phoneNumbers)];
    },
    paginatedabonnes() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;

      // Filter by both search term and phone number
      const filteredabonnes = this.abonnes.filter((item) =>
        item.etat.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.filterByPhoneNumber === '' || item.num_telephone === this.filterByPhoneNumber)
      );

      return filteredabonnes.slice(startIndex, endIndex);


    },
    filterAbonnesByEtat() {
      this.filteredabonnes = this.abonnes.filter(item =>
        item.type_zone.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
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

.v-table tbody tr {
  border-bottom: 1px solid transparent;
  background-color: var(--v-danger-base);
  /* Use the desired red color code */
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