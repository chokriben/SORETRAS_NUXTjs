<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="card-shadow" :class="typabon === 'eleve' ? 'eleve' : 'non-eleve'">
          <v-card-title class="text-center" style="font-size: 17px">
            demande d'abonnement scolaire de tranport régional
          </v-card-title>
          <v-card-subtitle class="text-center">Année scolaire : {{ currentYear - 1 }}-{{
            currentYear
          }}</v-card-subtitle>
          <br />
          <v-card>
            <v-form>
              <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>{{ snackbar.message
              }}</v-snackbar>
              <v-row class="form">
                <v-col cols="12" sm="6">
                  <v-text-field v-model="prenom" color="primary" label="الاسم الكامل *"
                    prepend-inner-icon="mdi-account"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <ImageUpload @uploaded="image = $event" />
                  <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد *"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="cin" label="أدخل رقم بطاقة التعريف *"
                    prepend-inner-icon="mdi-card-account-details-outline" :rules="[cinRule]" :error-messages="cinErrors"
                    required disabled></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field type="email" v-model="email" color="primary" label="البريد الإلكتروني *"
                    prepend-inner-icon="mdi-at"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="num_telephone" color="primary" label="الهاتف *"
                    prepend-inner-icon="mdi-phone"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="adresse" color="primary" label="العنوان *"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-text-field v-model="nom_parent" color="primary" style="display: none" label="Parent"
                  prepend-inner-icon="mdi-account-tie"></v-text-field>

                <v-text-field v-model="classe" color="primary" style="display: none" label="Classe"
                  prepend-inner-icon="mdi-school"></v-text-field>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="profession" color="primary" label="المهنة *"
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
                        <v-radio label="سداسي 1" value="sem1"></v-radio>
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
                      المنطقة <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete>
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
                            ligne.fin_station_name +
                            " - " +
                            ligne.cod
                          }}
                        </option>
                      </select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-col cols="12" sm="12">
                  <v-col cols="12" sm="12" class="montant" v-if="prix !== 0">
                    {{ typ_yes }}<br>
                    السعر: {{ prix }} دينار<br />
                    + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
                  </v-col>
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
            </v-form>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ImageUpload from "@/components/ImageUpload.vue"; // Ajustez le chemin vers votre composant
import { ref, onMounted, computed } from "vue";

import axios from "axios";
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
import { useAdminStore } from "@/store/auth";
definePageMeta({
  layout: "parent",
});
const currentYear = ref(new Date().getFullYear());
const type_abonne = ref("ordinare");
const image = ref("");
const select_prix = ref("");
const prix = ref(0);
const garess = ref([]);
const selectedGareId = ref(null);
const typ_yes = ref("");
const adminStore = useAdminStore();
const semestre = ref(null);
const ligne = ref('');
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
const cin = ref(localStorage.getItem("cin"));
const classe = ref("");
const nom_parent = ref("");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});

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
  amount: prix.value,
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

function handleSemestreChange() {
  //console.log("hello");
  select_line.value = null;
  prix.value = 0;
}
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
    if (semestre.value === 'an') {
      idd.value = idd.value + 10;
    }
    try {
      const response = await axios.get(
        "https://api.srtk.com.tn/api/abonneprix/show/" + idd.value
      );
      typ_yes.value = response.data.tarif.nom;
      prix.value = response.data.tarif.prix;
      // return (prix.value = response.data.tarif.prix);
      // Faites ici l'appel HTTP à l'API et traitez la réponse
      // Stockez les données de l'API dans abonnesPrixData
    } catch (error) {
      console.error("Error fetching gares:", error);
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
      order.amount = prix.value;
    } else {
      console.error("Invalid API response:", response.data);
    }
  } catch (error) {
    console.error(error);
  }
}

function redirectToPaymentPage() {
  if (!paymentSessionId.value) {
    console.error("Payment Session ID is missing.");
    return;
  }

  const paymentPageUrl = `https://tnpost.gateway.mastercard.com/checkout/pay/${paymentSessionId.value}`;

  try {
    // Redirect the user to the payment page
    Checkout.configure({
      merchant: `${merchant.merchentid}`,
      session: {
        id: paymentSessionId.value,
      },
      order: {
        amount: prix.value,
        currency: order.currency,
        description:
          "Payer pour la commande #" + order.orderid + " via Carte de crédit",
        customerOrderDate: "2022-09-22",
        customerReference: "0",
        reference: `REF-${order.orderid}`,
        id: order.orderid,
      },
      transaction: {
        reference: `TRF${order.orderid}`,
      },
      customer: {
        firstName: customer.fname,
        lastName: customer.lname,
        email: customer.email,
        mobilePhone: "+216 98 123 123",
        phone: customer.phone,
      },
      billing: {
        address: {
          city: "Tunis",
          country: "TUN",
          postcodeZip: "1023",
          stateProvince: "Tunis",
          street: "tunis rue 00",
          street2: "rue hedi nuira tunis",
        },
      },
      interaction: {
        merchant: {
          name: "SRT-Kasserine",
          address: {
            line1: "",
            line2: "",
          },
        },
        locale: "fr_FR",
        displayControl: {
          billingAddress: "HIDE",
          customerEmail: "OPTIONAL",
          orderSummary: "HIDE",
          shipping: "HIDE",
        },
      },
    });
    Checkout.showPaymentPage(); // Show the payment page using the configured options
  } catch (error) {
    console.error(
      "Error redirecting to Mastercard Payment Page:",
      error.message
    );
    // Implement a fallback mechanism here, e.g., display an error message to the user.
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
  if (typeecol.value === "pub") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_Primaire"
    );
  } else if (typeecol.value === "priv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement != "Etatique_Primaire"
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
  selected.value = "";
  select_line.value = "";
  prix.value = "";
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
  if (age.value > 22) {
    snackbar.value = {
      show: true,
      message: "L'âge ne peut pas dépasser 22 ans.",
      color: "error",
    };
    return; // Stop form submission
  }
  customer.fname = prenom.value;
  customer.lname = classe.value;
  customer.adresse = adresse.value;
  customer.email = email.value;
  customer.phone = num_telephone.value;
  order.amount = prix.value;
  const requiredFields = [
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
  //console.log(prix.value);
  try {
    await createSession();

    // Redirect to the payment page if a payment session ID was successfully generated
    if (paymentSessionId.value) {
      //  redirectToPaymentPage(); // Only call this function here
    } else {
      // Handle the case where the payment session ID is not generated
      console.error("Payment Session ID is missing or not generated.");
      // You can show an error message or perform other actions here if needed.
    }
  } catch (error) {
    console.error("Registration failed:", error);
    // Handle the error, show a message, or perform other actions if needed.
  }

  let typePeriode = semestre.value === "sem1" ? "semestre 1" : "annuel";

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
  //const x = lignes.value.find(item => item.name === select_line.value);

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
    type_eleve: "oridnaire",
    type_inscrit: "non-inscrit",
    etat: "En cours",
    type_paiment: typ_yes.value,
    image: image.value,
    orderid: num_order,
    profession_fr: profession.value,
    profession_en: profession.value,
    profession_ar: profession.value,
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

.icon-ics:hover {
  /* .ico {
        color: #0053a0;
    } */
}
</style>
