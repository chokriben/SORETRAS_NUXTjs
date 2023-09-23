<template>
  <div>

    <v-card class="mb-2">
      <v-card-title class="text-h6 mt-4 ml-3">
        الشؤون الاجتماعية
      </v-card-title>

      <v-card>
        <v-form>
          <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
            {{ snackbar.message }}
          </v-snackbar>


          <v-col cols="12" sm="6">
            <select v-model="selected" class="forms">
              <option value="null" selected>
                Sélectionnez un établissement
              </option>
              <option v-for="etablissement in filteredEtablissements" :key="etablissement.id" :value="etablissement.id">
                {{ etablissement.translations[0].labelle }}
              </option>

            </select>
          </v-col>
          <v-col cols="12" sm="6">
            <input v-model="image" class="form-control" name="image" />
            <ImageUpload @uploaded="image = $event" />
            <img v-if="image" :src="`https://api.srtk.com.tn/${image}`" :style="getImageStyle" alt="Selected Image" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="classe" color="primary" label="Classe *"
              prepend-inner-icon="mdi-school"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="cin" color="primary" label="cin *" prepend-inner-icon="mdi-account"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="unique_id" color="primary" label="unique-identifier *"
              prepend-inner-icon="mdi-account"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="prenom" color="primary" label="Nom & Prénom *"
              prepend-inner-icon="mdi-account"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="date_naissance" type="date" color="primary" label="Date de naissance *"
              prepend-inner-icon="mdi-calendar-month"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="nom_parent" color="primary" label="Nom Parent *"
              prepend-inner-icon="mdi-account-tie"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="adresse" color="primary" label="Adresse"
              prepend-inner-icon="mdi-map-marker"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field type="email" v-model="email" color="primary" label="Email *"
              prepend-inner-icon="mdi-at"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="num_telephone" color="primary" label="Téléphone *"
              prepend-inner-icon="mdi-phone"></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field v-model="profession" color="primary" label="Profession" style="display: none"
              prepend-inner-icon="mdi-account-tie"></v-text-field>
          </v-col>
          <v-card-text style="width: 100%">
            <v-radio-group v-model="semestre">
              <v-row>
                <v-col cols="12" sm="3">
                  Période <span style="color: red">*</span>
                  <span class="mdi mdi-play"></span>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-radio label="Semestre 1" value="sem1"></v-radio>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-radio label="Semestre 2" value="sem2"></v-radio>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-radio label="Annuel" value="an"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-card-text>
          <v-card-text style="width: 100%">
            <v-radio-group v-model="ligne">
              <v-row>
                <v-col cols="12" sm="4">
                  Région <span style="color: red">*</span>
                  <span class="mdi mdi-play"></span>
                </v-col>
                <v-col cols="6" sm="6">
                  <select v-model="selectedGareId" class="forms" autocomplete>
                    <option value="null">Sélectionnez une région</option>

                    <option v-for="gare in garess" :key="gare.id" :value="gare.id">
                      {{ gare.name }}
                    </option>

                  </select>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-card-text>
          <v-card-text style="width: 100%">
            <v-row>
              <v-col cols="12" sm="4">
                Ligne <span class="mdi mdi-play"></span>
              </v-col>

              <v-col cols="12" sm="6">
                <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                  <option value="">Sélectionnez une ligne</option>
                  <option v-for="ligne in lignes" :key="ligne.id" :value="ligne.id">
                    {{
                      ligne.station_name +
                      " - " +
                      ligne.fin_station_name +
                      " - " +
                      ligne.cod
                    }}
                  </option>
                </select>
              </v-col>
            </v-row>
          </v-card-text>

          <v-col cols="12" sm="12" class="montant" v-if="prix !== 0">
            {{ typ_yes }}<br />
            السعر: {{ prix }} دينار<br />
            + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
          </v-col>
          <v-btn class="insert-button" @click="handleInsert"> <v-icon left>mdi-plus</v-icon>Inserer</v-btn>


          <table class="data-table">
            <thead>
              <tr>
                <th>بريد إلكتروني</th>
                <th> رقم بطاقة التعريف الوطنية للولي</th>
                <th>رقم الهاتف.</th>

                <th>تاريخ الميلاد </th>
                <th>اسم و لقب (تلميذ أو طالب) </th>
                <th>اسم و لقب الولي</th>
                <th>عنوان السكن</th>
                <th>صف مدرسي</th>
                <th> صورة </th>
                <th>المعهد</th>
                <th> المنطقة </th>
                <th> الخط المطلوب </th>
                <th> فترة </th>
                <th> تعديل </th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tableRows" :key="index" class="table-row">
                <td>{{ row.email }}</td>
                <td>{{ row.cin }}</td>
                <td>{{ row.num_telephone }}</td>
                <td>{{ row.date_naissance }}</td>
                <td>{{ row.prenom }}</td>
                <td>{{ row.nom_parent }}</td>
                <td>{{ row.adresse }}</td>

                <td>{{ row.classe }}</td>
                <td>
                  <v-img :src="`https://api.srtk.com.tn/${row.image}`" alt="Image" width="50px" height="50px" cover
                    @error="handleImageError"></v-img>
                </td>
                <td>{{ getEtablissementName(row.etablissement) }}</td>
                <td>{{ getZoneName(row.gare_id) }}</td>
                <td>{{ getLineName(row.ligne_id) }}</td>
                <td>{{ row.type_periode }}</td>
                <td>
                  <v-btn @click="deleteRowWithConfirmation(index)" color="red" text>
                    <v-icon>mdi-delete</v-icon> </v-btn>
                </td>

              </tr>
            </tbody>
          </table>
          <v-btn class="validate-button" @click="validateRows"> <v-icon left>mdi-check</v-icon> Valider</v-btn>

        </v-form>
      </v-card>
    </v-card>

  </div>
  <v-dialog v-model="showDeleteDialog" max-width="300">
    <v-card>
      <v-card-title class="headline">Supprimer la ligne</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer cette ligne ?
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" text @click="showDeleteDialog = false">Annuler</v-btn>
        <v-btn color="green" text @click="confirmDelete">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import ImageUpload from "@/components/ImageUpload.vue"; // Ajustez le chemin vers votre composant
import { ref, onMounted, computed } from "vue";

import axios from "axios";
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

definePageMeta({
  layout: "admin",
});
const getImageStyle = computed(() => {
  const style = {
    maxWidth: "100px",
    marginTop: "20px",
  };
  return style;
});
const typ_yes = ref("");
const image = ref("");
const select_prix = ref("");
const prix = ref(0);
const garess = ref([]);
const selectedGareId = ref(null);
const semestre = ref(null);
const ligne = ref(null);
const abn = ref([]);
const zone = ref("");
const typeecol = ref(null);
const selected = ref(null);
const select_line = ref(null);
const etablissements = ref([]);
const lignes = ref([]);

const password = ref("");
const email = ref("");
const num_telephone = ref("");
const date_naissance = ref("");
const profession = ref("");
const prenom = ref("");
const adresse = ref("");
const cin = ref("");
const unique_id = ref("");
const classe = ref("");
const nom_parent = ref("");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});

const showDeleteDialog = ref(false);
const selectedIndexToDelete = ref(null);



const confirmDelete = () => {
  if (selectedIndexToDelete.value !== null) {
    deleteRow(selectedIndexToDelete.value);
    showDeleteDialog.value = false;
    selectedIndexToDelete.value = null;
  }
};

const deleteRowWithConfirmation = (index) => {
  selectedIndexToDelete.value = index;
  showDeleteDialog.value = true;
};
const deleteRow = (index) => {
  tableRows.value.splice(index, 1);
};


// Move the getEtablissementName function to this level
const getEtablissementName = (etablissementId) => {
  const etablissement = etablissements.value.find(etablissement => etablissement.id === etablissementId);
  return etablissement ? etablissement.translations[0].labelle : '';
};
// Function to get the name of the zone (المنطقة) based on the gare_id
const getZoneName = (gareId) => {
  const gare = garess.value.find((gare) => gare.id === gareId);
  return gare ? gare.name : '';
};

const handleImageError = (event) => {
  // Handle the image loading error, e.g., show a placeholder or error message
  event.target.src = 'https://api.srtk.com.tn/${item.src}'; // Set a placeholder image  https://api.srtk.com.tn/${item.src}
};

// Function to get the name of the line (الخط المطلوب) based on the ligne_id
const getLineName = (ligneId) => {
  const ligne = lignes.value.find((ligne) => ligne.id === ligneId);
  return ligne ? `${ligne.station_name} - ${ligne.fin_station_name} - ${ligne.cod}` : '';
};
const tableRows = ref([]);
const handleInsert = () => {
  // Ajoutez cette vérification pour le champ "id_unique"
  if (!unique_id.value || !/^\d{12}$/.test(unique_id.value)) {
    snackbar.value = {
      show: true,
      message: "L'ID unique doit contenir exactement 12 chiffres.",
      color: "error"
    };
    return; // Arrêtez l'exécution supplémentaire
  }
  const requiredFields = [
    email.value,
    cin.value,
    unique_id.value,
    num_telephone.value,
    date_naissance.value,
    prenom.value,
    nom_parent.value,
    adresse.value,
    classe.value,
    selected.value,
    select_line.value,
    selectedGareId.value,
    prix.value,
    image.value
  ];

  const isAllFieldsFilled = requiredFields.every((field) => !!field);

  if (!isAllFieldsFilled) {
    snackbar.value = {
      show: true,
      message: "Veuillez remplir tous les champs.",
      color: "error"
    };
    return; // Stop further execution
  }
  // Validate cin field
  if (cin.value.length !== 8 || isNaN(cin.value)) {
    snackbar.value = {
      show: true,
      message: "Le champ cin doit contenir exactement 8 chiffres.",
      color: "error"
    };
    return; // Stop further execution
  }
  const rowData = {
    email: email.value,
    cin: cin.value,
    id_uniq: unique_id.value,

    num_telephone: num_telephone.value,
    date_naissance: date_naissance.value,

    prenom: prenom.value,
    nom_parent: nom_parent.value,
    adresse: adresse.value,

    classe: classe.value,
    etablissement: selected.value,

    ligne_id: select_line.value,
    gare_id: selectedGareId.value,

    prix: prix.value,
    // type_zone: selectedGareId.value ? "Zone B" : "Zone A", // Set type zone based on selectedGareId
    // type_validite: "un", // Set type validite based on your logic
    type_periode: semestre.value === "sem1" ? "semestre 1" : "semestre 2", // Set type periode based on semestre

    image: image.value, // Utilisez la propriété 'image'

  };


  // Add the row data to the tableRows array
  tableRows.value.push(rowData);


  // Clear the form fields after insertion
  resetForm();
};

// Define the validateRows function
const validateRows = async () => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  try {
    for (const rowData of tableRows.value) {

      // rowData.ligne_id = idd.value;


      await axios.post("https://api.srtk.com.tn/api/admin/abonne/insert-multiple", rowData, { headers });
    }
    // Clear the tableRows array after successful insertion
    tableRows.value = [];

    // Show a success message or perform any necessary actions
    snackbar.value = {
      show: true,
      message: "Data inserted into the database.",
      color: "success",
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: "Error inserting data into the database.",
      color: "error",
    };
    console.error("Error inserting data:", error);
  }
};


const idd = ref("");
async function fetchAbonnesPrix(id) {
  // Appel à l'API abonnesprix lorsque la sélection change
  if (id != "") {
    try {
      ////console.log(id);
      const response = await axios.get(
        "https://api.srtk.com.tn/api/ligne_station/" + id
      );
      idd.value = response.data.Lignes[0].ligne_id;

      ligne.value = idd.value;
      const response1 = await axios.get(
        "https://api.srtk.com.tn/api/lgine/show/" + idd.value
      );
      idd.value = response1.data.Ligne[0].cod;
      // Faites ici l'appel HTTP à l'API et traitez la réponse
      // Stockez les données de l'API dans abonnesPrixData
    } catch (error) {
      console.error("Error fetching gares:", error);
    }
    const v = idd.value % 1000;
    idd.value = idd.value - v;
    idd.value = idd.value / 1000;

    try {
      const response = await axios.get(
        "https://api.srtk.com.tn/api/abonneprix/show/" + idd.value
      );
      typ_yes.value = response.data.tarif.nom;
      prix.value = response.data.tarif.prix;

      // Faites ici l'appel HTTP à l'API et traitez la réponse
      // Stockez les données de l'API dans abonnesPrixData
    } catch (error) {
      console.error("Error fetching gares:", error);
    }
  } else {
    return (prix.value = "");
  }
}




// Fetch gares
async function fetchgares() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/gares");
    return (garess.value = response.data.Gares.data);
  } catch (error) {
    console.error("Error fetching gares:", error);
  }
}

// Fetch etablissements
async function fetchEtablissements() {
  try {
    const response = await axios.get(
      "https://api.srtk.com.tn/api/etablissements"
    );
    etablissements.value = response.data.etablissements;
  } catch (error) {
    console.error("Error fetching etablissements:", error);
  }
}
//fetch lignes

async function fetchLignes() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/ligne_station");
    const data = response.data.Lignes; // Access the 'data' property within the 'Lignes' object
    lignes.value = data;
  } catch (error) {
    console.error("Error fetching lignes:", error);
  }
}
async function fetchAbn() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/abonnesprix");
    const data = response.data.abonnesPrix.data; // Access the 'data' property within the 'Lignes' object
    abn.value = data;
  } catch (error) {
    console.error("Error fetching lignes:", error);
  }
}

const filteredEtablissements = computed(() => {
  const etablissementsToFilter = etablissements.value;

  const filters = {
    Etatique: ["Etatique_Primaire", "Etatique_lycee", "Etatique_College"],
    Prive: ["Prive_Primaire", "Prive_Secondaire"]
  };

  const selectedFilter = typeecol.value === "etatique" ? "Etatique" : "Prive";

  return etablissementsToFilter.filter((item) =>
    filters[selectedFilter].includes(item.typeetablissement)
  );
});

function setVariable() {
  // Extraire le prix de la sélection et affecter à la variable v
  if (select_prix.value) {
    //console.log(select_prix.value);
    const parts = select_prix.value.split(" - "); // Supposer que l'élément est de la forme "nom prix"
    prix.value = parts[1];
    //console.log(prix); // Extraire le prix en tant que nombre
    // Affecter le prix à la variable v
  } else {
    prix.value = ""; // Réinitialiser la variable v si aucune sélection n'est faite
  }
}

// Call fetchEtablissements on component mount
onMounted(() => {
  (async () => {
    await fetchgares();
    await fetchEtablissements();
    await fetchLignes();
    await fetchAbn();
  })();
});

const resetForm = () => {
  password.value = "";
  email.value = "";
  num_telephone.value = "";
  date_naissance.value = "";
  cin.value = "",
    unique_id.value = "",
    prenom.value = "";
  nom_parent.value = "";
  adresse.value = "";
  classe.value = "";
  selected.value = null;
  select_line.value = null;
  selectedGareId.value = null;
  prix.value = "";
  image.value = "";
};

const handleRegistration = async () => {
  try {
    for (const rowData of tableRows.value) {
      // Insert rowData into the database (use your API endpoint)
      await axios.post("YOUR_INSERT_API_URL", rowData);
    }
    // Clear the tableRows array after successful insertion
    tableRows.value = [];

    // Show a success message or perform any necessary actions
    snackbar.value = {
      show: true,
      message: "Data inserted into the database.",
      color: "success",
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: "Error inserting data into the database.",
      color: "error",
    };
    console.error("Error inserting data:", error);
  }
  const requiredFields = [
    nom_parent.value,
    classe.value,
    email.value,
    num_telephone.value,
    email.value,
    date_naissance.value,
    adresse.value,
    prenom.value,
    prix.value,
  ];

  const isAllFieldsFilled = requiredFields.every((field) => !!field);


  if (!isAllFieldsFilled) {
    snackbar.value = {
      show: true,
      message: "Veuillez remplir tous les champs.",
      color: "error",
    };
    return; // Stop further execution
  }
  if (num_telephone.value.length !== 8) {
    snackbar.value.message =
      "Le champ numero de telnum_telephone doit contenir exactement 8 chiffres.";
    snackbar.value.color = "error";
    snackbar.value.show = true;
    return; // Stop form submission
  }
  if (!emailRegex.test(email.value)) {
    snackbar.value = {
      show: true,
      message: "Email is not valid!",
      color: "error",
      position: "top",
    };

    resetForm();
    return;
  }



  let typePeriode =
    semestre.value === "semestre 1" ? "semestre 1" : "semestre 2";

  let typeValidite = null;

  if (ligne.value === "un") {
    typeValidite = "un";
  } else if (ligne.value === "tout") {
    typeValidite = "tout";
  }

  let typeZone = null;
  if (zone.value === "un") {
    typeZone = "Zone A";
  } else if (zone.value === "tout") {
    typeZone = "Zone B";
  }

  let typeInstitut = null;

  if (typeecol.value === "pub") {
    typeInstitut = "pub";
  } else if (typeecol.value === "priv") {
    typeInstitut = "priv";
  }

  const etablissement = etablissements.value.find(
    (item) => item.labelle === selected.value
  );
  const x = lignes.value.find((item) => item.name === select_line.value);

  if (num_telephone.value.length !== 8) {
    snackbar.value.message =
      "Le champ numero de telnum_telephone doit contenir exactement 8 chiffres.";
    snackbar.value.color = "error";
    snackbar.value.show = true;
    return; // Stop form submission
  }
  if (!emailRegex.test(email.value)) {
    snackbar.value = {
      show: true,
      message: "Email is not valid!",
      color: "error",
      position: "top",
    };
    resetForm();
    return;
  }

  const payload = {
    email: email.value,
    cin: cin.value,
    unique_id: unique_id.value,
    num_telephone: num_telephone.value,
    date_naissance: date_naissance.value,
    prenom_fr: prenom.value,
    prenom_en: prenom.value,
    prenom_ar: prenom.value,
    nom_parent_fr: nom_parent.value,
    nom_parent_en: nom_parent.value,
    nom_parent_ar: nom_parent.value,
    adresse_fr: adresse.value,
    adresse_en: adresse.value,
    adresse_ar: adresse.value,
    classe_fr: classe.value,
    classe_en: classe.value,
    classe_ar: classe.value,
    prix: prix.value,
    ligne_id: ligne.value,
    Etablissement_id: selected.value,
    type_validite: typeValidite,
    type_zone: selectedGareId.value,
    type_periode: typePeriode,
    type_institut: typeInstitut,
    type_eleve: "eleve",
    type_inscrit: "non-inscrit",
    etat: "En cours",
    image: image.value,
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  try {
    await axios.post("https://api.srtk.com.tn/api/abonne/add", payload, {
      headers,
    });

    snackbar.value = {
      show: true,
      message: "Registration successful!",
      color: "success",
    };
    resetForm();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      snackbar.value = {
        show: true,
        message: error.response.data.message,
        color: "error",
      };
    } else if (error.response && error.response.data) {
      // Display the error message from the response
      snackbar.value = {
        show: true,
        message: error.response.data.message,
        color: "error",
      };
    } else {
      snackbar.value = {
        show: true,
        message: "Erreur lors de l'insertion des données.",
        color: "error",
      };
    }
    console.error("Registration failed:", error);
  }

};

</script>
<style>
.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  margin-top: 20px;
  table-layout: fixed;
  /* Add this line */
}

.data-table th,
.data-table td {
  padding: 12px;
  border: 1px solid #ddd;
  white-space: normal;
  /* Change this from 'nowrap' to 'normal' */
  font-size: 14px;
  text-align: center;
}

.data-table th {
  background-color: #f2f2f2;
  padding: 12px;
  border: 1px solid #ddd;
  font-weight: bold;
}

/* Style for table rows */
.table-row:nth-child(even) {
  background-color: #f2f2f2;
}

.table-row td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

/* Primary button style */
.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

/* Danger button style */
.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

/* Form select style */
.forms {
  background-color: #f6f6f6;
  width: 100%;
  padding: 15px;
  box-shadow: 1px 1px 8px -7px #333;
}

/* Center the content in table cells */
td {
  padding: 0 10px !important;
}

/* Style for login text */
.login {
  color: white;
}

/* Form label style */
.v-label {
  font-size: 14px;
}

/* Capitalize the text of checkboxes */
.check {
  text-transform: capitalize;
}

/* Button style with specific class */
.bt-ics {
  font-size: 14px !important;
  text-transform: capitalize;
  background: linear-gradient(to top, #0053a0, #3182ce) !important;
  color: white;
}

.bt-ics:hover {
  background: linear-gradient(to bottom, #0053a0, #4aa2f5) !important;
  color: white;
}

/* Style for the "Montant" section */
.montant {
  color: red;
}

/* Form style */
.form {
  padding: 20px;
}

/* Card shadow style */
.card-shadow {
  padding: 30px;
}

.card-shadow:hover {
  box-shadow: 0px 0px 7px 0px;
}

/* Eleve style */
.eleve {
  background: linear-gradient(to top, #07447e, #2793f8);
  color: white;
}

/* Non-eleve style */
.non-eleve {
  background-color: white;
}

/* Icon styles */
.icon-ics {
  text-align: center;
  width: 40%;
  margin: 0 auto;
  padding-top: 10px;
  margin-top: 30px;
  background-color: rgba(255, 255, 255, 0.836);
  color: rgb(27, 27, 27);
  box-shadow: 0px 0px 20px 3px;
}

.ico {
  font-size: 70px;
  margin-bottom: 3px;
  color: rgb(129, 129, 129);
}

/* Insert button style */
.insert-button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  background-color: green;
  color: white;
}

/* Validate button style */
.validate-button {
  display: block;
  margin: 20px auto 0;
  background-color: red;
  color: white;
}
</style>



