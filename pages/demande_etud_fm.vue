<template>
  <div>
    <v-card class="mb-2">
      <v-card-title class="text-h6 mt-4 ml-3" style="text-align: center;">
        demande d'abonnement scolaire de transport urbain
        <br>
        <div style="color:red">Veuillez saisir les données en arabe<br>الرجاء إدخال البيانات باللغة العربية</div>
      </v-card-title>
      <v-card>
        <v-form>
          <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
            {{ snackbar.message }}
          </v-snackbar>
          <v-card-text>
            <v-radio-group v-model="typeecol">
              <v-row>
                <v-col cols="12" sm="4">
                  Ecole <span class="mdi mdi-play"></span>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-radio label="Public" value="pub"></v-radio>
                </v-col>

              </v-row>
            </v-radio-group>
          </v-card-text>
          <v-row v-if="typeecol === 'pub'" class="form">
            <v-col cols="12" sm="6">
              <select v-model="selected" class="forms">
                <option value="null" selected>
                  Sélectionnez un établissement
                </option>
                <option v-for="etablissement in filteredEtablissements" :value="etablissement.id">
                  {{ etablissement.translations[0].labelle }}
                </option>
              </select>
            </v-col>
            <v-col cols="12" sm="6">

              <ImageUpload @uploaded="image = $event" />
              <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
            </v-col>
            <v-col cols="12" sm="6">

              <select v-model="classe" class="forms" autocomplete>
                <option value="">الصف</option>
                <option value="السنة الأولى">السنة الأولى</option>
                <option value="السنة الثانية">السنة الثانية</option>
                <option value="السنة الثالثة">السنة الثالثة</option>
                <option value="السنة الأولى ماجستير"> السنة الأولى ماجستير</option>
                <option value="السنة الثانية ماجستير"> السنة الثانية ماجستير</option>


              </select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="cin" color="primary" label="رقم بطاقة التعريف الوطنية *"
                prepend-inner-icon="mdi-school" disabled></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="prenom" color="primary" label="Nom & Prénom *" prepend-inner-icon="mdi-account"
                disabled></v-text-field>
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
              <v-radio-group v-model="semestre" @change="handleSemestreChange">
                <v-row>
                  <v-col cols="12" sm="3">
                    الفترة <span style="color: red">*</span>
                    <span class="mdi mdi-play"></span>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="سداسي" value="sem1"></v-radio>
                  </v-col>

                  <v-col cols="6" sm="3">
                    <v-radio label="سنوي" value="an"></v-radio>
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
                    <select v-model="selectedGareId" class="forms" autocomplete
                      @change="fetchAbonnesligne(selectedGareId)">
                      <option value="null">Sélectionnez une région</option>
                      <option v-for="gare in garess" :value="gare.id">
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
                    <option value="null">Sélectionnez une ligne</option>
                    <option v-for="ligne in lignes" :value="ligne.id">
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
            <v-col cols="12" sm="12">
              <div>
                <div v-if="!paymentSessionId">
                  <v-btn @click="handleRegistration" class="bt-ics">S'inscrire</v-btn>
                </div>

                <!-- Payment Section -->
                <div v-else>
                  <div class="btn-container">
                    <v-btn color="primary" @click="redirectToPaymentPage">Passez à l'étape de paiement</v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <!-- Prive -->
          <v-row v-if="typeecol === 'priv'" class="form">
            <v-col cols="12" sm="6">
              <select v-model="selected" class="forms">
                <option value="null" selected>
                  Sélectionnez un établissement
                </option>
                <option v-for="etablissement in filteredEtablissements" :value="etablissement.id">
                  {{ etablissement.translations[0].labelle }}
                </option>
              </select>
            </v-col>
            <v-col cols="12" sm="6">

              <ImageUpload @uploaded="image = $event" />
              <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="classe" color="primary" label="الصف *"
                prepend-inner-icon="mdi-school"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="prenom" color="primary" label="Nom & Prénom *"
                prepend-inner-icon="mdi-school"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد *"
                prepend-inner-icon="mdi-calendar-month"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="nom_parent" color="primary" label="اسم ولي الأمر *"
                prepend-inner-icon="mdi-account-tie"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="adresse" color="primary" label="العنوان *"
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

            <v-card-text style="width: 100%">
              <v-radio-group v-model="semestre" @change="handleSemestreChange">
                <v-row>
                  <v-col cols="12" sm="3">
                    الفترة <span style="color: red">*</span>
                    <span class="mdi mdi-play"></span>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="سداسي" value="sem1"></v-radio>
                  </v-col>

                  <v-col cols="6" sm="3">
                    <v-radio label="سنوي" value="an"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-card-text>
            <v-card-text style="width: 100%">
              <v-row>
                <v-col cols="12" sm="4">
                  Région <span style="color: red">*</span>
                  <span class="mdi mdi-play"></span>
                </v-col>
                <v-col cols="6" sm="6">
                  <select v-model="selectedGareId" class="forms" autocomplete @change="fetchAbonnesligne(selectedGareId)">
                    <option value="null">اختر منطقة</option>
                    <option v-for="gare in garess" :value="gare.id">
                      {{ gare.name }}
                    </option>
                  </select>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text style="width: 100%">
              <v-row>
                <v-col cols="12" sm="4">
                  الخط <span class="mdi mdi-play"></span>
                </v-col>

                <v-col cols="12" sm="6">
                  <select v-model="select_line" class="forms" @change="fetchAbonnesPrix(select_line)">
                    <option value="null">اختر خطًا</option>
                    <option v-for="ligne in lignes" :value="ligne.id">
                      {{
                        ligne.station_name +
                        " - " +
                        ligne.fin_station_name
                      }}
                    </option>
                  </select>
                </v-col>
              </v-row>
            </v-card-text>

            <v-col cols="12" sm="12">


              <div>
                <div v-if="!paymentSessionId">
                  <v-btn @click="handleRegistration" class="bt-ics">S'inscrire</v-btn>
                </div>

                <!-- Payment Section -->
                <div v-else>

                </div>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-card>
  </div>
</template>
<script setup>
import ImageUpload from "@/components/ImageUpload.vue"; // Ajustez le chemin vers votre composant
import { ref, onMounted, computed } from "vue";

import axios from "axios";

import { useAdminStore } from "@/store/auth";
definePageMeta({
  layout: "p",
});
const router = useRouter();
const csrf_token = ref(null);
const csrfToken = ref(null);
const type_abonne = ref("scolaire");
const urlParams = new URLSearchParams(window.location.search);
const typ_yes = ref("");
const image = ref("");
const select_prix = ref("");
let prix = ref(0);
const garess = ref([]);
const selectedGareId = ref(null);
const price = ref(0);
const adminStore = useAdminStore();
let semestre = ref(null);
const ligne = ref(null);
const abn = ref([]);
const zone = ref("");
const typeecol = ref('pub');
const selected = ref(null);
const select_line = ref(null);
const etablissements = ref([]);
const lignes = ref([]);
const password = ref("");
const email = ref("");
const num_telephone = ref("");
const date_naissance = ref("");
const profession = ref("");
const abonnesPrixData = ref(null);
const prenom = ref(urlParams.get('prenom') + ' ' + urlParams.get('nom'));
const adresse = ref("");
const cin = ref(urlParams.get('cin'));
const classe = ref("");
const nom_parent = ref("");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});
const headers = {
  "Content-Type": "multipart/form-data",
  'CSRF-TOKEN': csrfToken.value, // Use csrfToken.value to access the ref value
};

const getToken = async () => {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/token");
    csrfToken.value = response.data.csrf_token; // Set the csrfToken
    headers.csrf_token = csrfToken.value; // Add the CSRF token to the headers
    //console.log(csrfToken.value)
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
  }
};

const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};
const num_order = generateRandomCode() + Date.now().toString();
const currencies = ["TND"];
const customer = ref({
  fname: "",
  lname: "",
  adresse: "",
  email: "",
  phone: "",
});

const order = ref({
  orderid: num_order,
  amount: price,
  currency: "TND",
  returnUrl: "https://api.srtk.com.tn/api/recue_paiement?orderid=" + num_order,
});

const merchant = {
  merchentid: 1751000728,
  login: "merchant.1751000728", // Add the correct login
  passwd: "87244402abefc802e378f4977b544610",
};

const paymentSessionId = ref("");
const backendResult = ref({});
onMounted(() => {
  loadMastercardCheckoutScript();
});

function loadMastercardCheckoutScript() {
  const script = document.createElement("script");
  script.src =
    "https://tnpost.gateway.mastercard.com/checkout/version/62/checkout.js";

  document.head.appendChild(script);

  // Wait for the script to load before using the Checkout object
}

const idd = ref("");
function handleSemestreChange() {
  //console.log("hello");
  select_line.value = null;
  prix.value = 0;
}
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
    if (semestre.value === 'an') {
      idd.value = idd.value + 10;
    }
    //console.log("prixx", idd.value);
    //console.log("per", semestre.value);
    try {
      const response = await axios.get(
        "https://api.srtk.com.tn/api/abonneprix/show/" + idd.value
      );
      const newPrice = 3 + parseFloat(response.data.tarif.prix);

      // Mettez à jour la valeur de la variable price
      price.value = newPrice;
      typ_yes.value = response.data.tarif.nom;
      prix.value = response.data.tarif.prix;

      // Faites ici l'appel HTTP à l'API et traitez la réponse
      // Stockez les données de l'API dans abonnesPrixData
    } catch (error) {
      //console.error("Error fetching gares:", error);
    }
  } else {
    return (prix.value = "");
  }
}

async function createSession() {
  try {
    const response = await axios.post("https://api.srtk.com.tn/api/payement", {
      code: idd.value,
      login: merchant.login,
      passwd: merchant.passwd,
      ...merchant,
      ...customer.value,

      ...order.value,
    });
    if (
      response.data &&
      response.data.result === "SUCCESS" &&
      response.data.session &&
      response.data.session.id
    ) {
      const sessionId = response.data.session.id;
      paymentSessionId.value = sessionId; // Update the paymentSessionId here
      backendResult.value = response.data;
      order.amount = prix.value + 1 + 3;
    } else {
      // console.error("Invalid API response:", response.data);
    }
  } catch (error) {
    // console.error(error);
  }
}


// Fetch gares
async function fetchgares() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/gares");
    return (garess.value = response.data.Gares.data);
  } catch (error) {
    //console.error("Error fetching gares:", error);
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
    // console.error("Error fetching etablissements:", error);
  }
}
//fetch lignes

async function fetchLignes() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/ligne_station");
    const data = response.data.Lignes; // Access the 'data' property within the 'Lignes' object
    lignes.value = data;
    return data;
  } catch (error) {
    //  console.error("Error fetching lignes:", error);
  }
}

async function fetchAbonnesligne(ids) {
  const lignesData = await fetchLignes(); // Attendre que fetchLignes se termine
  console.log(ids);
  console.log(lignesData);
  const filteredLignes = lignesData.filter(
    (item) => item.gare_id == ids
  );
  lignes.value = filteredLignes;
}

async function fetchAbn() {
  try {
    const response = await axios.get("https://api.srtk.com.tn/api/abonnesprix");
    const data = response.data.abonnesPrix.data; // Access the 'data' property within the 'Lignes' object
    abn.value = data;
  } catch (error) {
    // console.error("Error fetching lignes:", error);
  }
}

const filteredEtablissements = computed(() => {
  if (typeecol.value === "pub") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_super"
    );
  } else if (typeecol.value === "priv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "priv_super"
    );
  } else {
    return [];
  }
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

  prenom.value = "";
  nom_parent.value = "";
  adresse.value = "";
  classe.value = "";
  selected.value = null;
  select_line.value = null;
  prix.value = "";
  image.value = "";
  id_unique.value = "";
};
const age = computed(() => {
  if (date_naissance.value) {
    const dob = new Date(date_naissance.value);
    const today = new Date();
    const ageInMillis = today - dob;
    const ageInYears = ageInMillis / (365 * 24 * 60 * 60 * 1000);
    return Math.floor(ageInYears);
  }
  return null;
});

const handleRegistration = async () => {

  customer.fname = prenom.value;
  customer.lname = classe.value;
  customer.adresse = adresse.value;
  customer.email = email.value;
  customer.phone = num_telephone.value;
  order.amount = prix.value;
  const requiredFields = [
    nom_parent.value,
    classe.value,

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

  if (!image.value) {
    snackbar.value = {
      show: true,
      message: "Veuillez charger votre photo",
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
  let typePeriode = semestre.value;

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
  const currentDate = new Date();
  //console.log(cin);
  const payload = {
    email: email.value,
    cin: cin.value,
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
    type_periode: semestre.value,
    type_institut: typeInstitut,
    type_eleve: "etuiant",
    type_inscrit: "non-inscrit",
    etat: "paye ch",
    type_paiment: typ_yes.value,
    image: image.value,
    unique_id: id_unique.value,
    orderid: num_order,
  };
  let abn = ref(null);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  try {
    abn = await axios.post("https://api.srtk.com.tn/api/abonne/add", payload, {
      headers,
    });

    snackbar.value = {
      show: true,
      message: "Inscription réussie !",
      color: "success",
    };
    //console.log(abn.data.code);
    router.push('/imprimerabonnes/?code=' + abn.data.code);
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
.forms {
  background-color: #f6f6f6;
  width: 100%;
  padding: 15px;
  box-shadow: 1px 1px 8px -7px #333;
}

td {
  padding: 0 10px !important;
}

.login {
  color: white;
}

.v-label {
  font-size: 14px;
}

.check {
  text-transform: capitalize;
}

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

.montant {
  color: red;
}

.form {
  padding: 20px;
}

.card-shadow {
  padding: 30px;
}

.card-shadow:hover {
  box-shadow: 0px 0px 7px 0px;
}

.eleve {
  background: linear-gradient(to top, #07447e, #2793f8);
  color: white;
}

.non-eleve {
  background-color: white;
}

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

select {
  width: 100%;
  background-color: #f6f6f6;
  padding: 12px;
  border-radius: 5px;
  border: 0.3px solid #9f9f9f;
}

/* 
.icon-ics:hover {

 .ico{
          color:#0053a0;
      }
} */
</style>
