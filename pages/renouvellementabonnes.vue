<template>
  <div>
    <v-card>
      <v-form>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
          {{ snackbar.message }}
        </v-snackbar>

        <v-row class="form">
          <v-col cols="12" sm="6">
            <v-autocomplete label="Select Etablissement *" :items="filteredEtablissements.map((item) => item.labelle)"
              v-model="selected" item-value="id" item-text="labelle" disabled>
              <template #no-data> Aucun établissement existe </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="classe" color="primary" label="Classe" prepend-inner-icon="mdi-school"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="prenom" color="primary" label="Nom & Prénom" prepend-inner-icon="mdi-account"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="date_naissance" type="text" color="primary" label="Date de naissance"
              prepend-inner-icon="mdi-calendar-month" disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="date_emission" type="text" color="primary" label="Date de emission"
              prepend-inner-icon="mdi-calendar-month" disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="nom_parent" color="primary" label="Nom Parent" prepend-inner-icon="mdi-account-tie"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field type="email" v-model="email" color="primary" label="Email" prepend-inner-icon="mdi-at"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="num_telephone" color="primary" label="Téléphone" prepend-inner-icon="mdi-phone"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="cin" color="primary" label="cin" prepend-inner-icon="mdi-phone"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="adresse" color="primary" label="Adresse *" prepend-inner-icon="mdi-map-marker"
              disabled></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field v-model="profession" color="primary" label="Profession" prepend-inner-icon="mdi-account-tie"
              disabled></v-text-field>
          </v-col>
          <v-card-text style="width: 100%">
            <v-radio-group v-model="semestre">
              <v-row>
                <v-col cols="12" sm="4">
                  Période <span style="color: red">*</span>
                  <span class="mdi mdi-play"></span>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-radio label="Semestre 1" value="sem1" :disabled="disableSem1"></v-radio>
                </v-col>
                <v-col cols="6" sm="4">
                  <v-radio label="Semestre 2" value="sem2" :disabled="disableSem2"></v-radio>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-card-text>

          <v-col cols="12" sm="6" v-if="ligne === 'un'">
            <v-select label="Ligne demandée" :items="lignes.map((item) => item.name)" v-model="select_line"
              item-value="id" item-text="name" disabled>
              <template #no-data> Aucune ligne existe </template>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12">
            <v-col cols="12" sm="12">
              <v-text-field v-model="prix" color="primary" label="Prix"
                prepend-inner-icon="mdi-currency-eur"></v-text-field>
            </v-col>

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
      </v-form>
    </v-card>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";

import axios from "axios";
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

definePageMeta({
  layout: "p",
});

const etablissement = ref([]);

const prix = ref(0);
const disableSem1 = ref(false);
const disableSem2 = ref(true);

const semestre = ref("");
const ligne = ref("");
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
const date_emission = ref("");
const profession = ref("");

const prenom = ref("");
const adresse = ref("");
const cin = ref("");
const classe = ref("");
const nom_parent = ref("");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});

const currencies = ["TND"];
const customer = ref({
  fname: "",
  lname: "",
  adresse: "",
  email: "",
  phone: "",
});

const order = ref({
  orderid: "12",
  amount: prix,
  currency: "TND",
  returnUrl: "https://api.srtk.com.tn/api/recue_paiement?orderid=" + num_order,
});

const merchant = {
  merchentid: 1751000728,
  login: "SRTK_user", // Add the correct login
  passwd: "0b755af420c06f7ef4d82ea5403a1082",
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

async function createSession() {
  try {
    const response = await axios.post("https://api.srtk.com.tn/api/payement", {
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
    const response = await axios.get("https://api.srtk.com.tn/api/lignes");

    lignes.value = response.data.Lignes.data;
  } catch (error) {
    console.error("Error fetching lignes:", error);
  }
}

const filteredEtablissements = computed(() => {
  return etablissements.value.filter((item) => item.codeetab === 431110);
});
async function fetchAbonnesData() {
  try {
    const response = await axios.get(
      `https://api.srtk.com.tn/api/abonnes?code=${localStorage.getItem("code")}`
    );

    if (response.status === 200) {
      const code = response.data.abonnes.data[0];

      if (code) {
        nom_parent.value = code.prenom;
        email.value = code.email;
        num_telephone.value = code.num_telephone;
        date_naissance.value = code.date_naissance;
        date_emission.value = code.date_emission;
        cin.value = code.cin;
        classe.value = classe.cin;
        adresse.value = code.adresse;
        profession.value = code.profession;
        semestre.value = code.semestre;
        semestre.value = code.type_periode;
        ligne.value = code.type_validite;
        zone.value = code.type_zone;
        // Find the matching ligne object
        const selectedLigne = lignes.value.find(
          (item) => item.id === code.ligne_id
        );
        select_line.value = selectedLigne ? selectedLigne.name : null;

        const selectedEtablissement = filteredEtablissements.value.find(
          (item) => item.id === code.Etablissement_id
        );
        selected.value = selectedEtablissement
          ? selectedEtablissement.labelle
          : null;
      } else {
        console.error("Objet code n'existe pas.");
      }
    } else {
      console.error("API call failed.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call fetchEtablissements on component mount
onMounted(() => {
  (async () => {
    await fetchEtablissements();
    await fetchLignes();
    await fetchAbonnesData();
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
  cin.value = "";
  select_line.value = "";
  semestre.value = "";
  zone.value = "";
  ligne.value = "";
  date_emission = "";
  profession = "";
};

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

  let typeValidite = null;

  if (ligne.value === "un") {
    typeValidite = "un";
  } else if (ligne.value === "tout") {
    typeValidite = "tout";
  }

  let typePeriode = null;

  if (semestre.value === "sem1") {
    typePeriode = "sem1";
  } else if (semestre.value === "sem2") {
    typePeriode = "sem2";
  }

  let typeZone = null;
  if (zone.value === "un") {
    typeZone = "un";
  } else if (zone.value === "tout") {
    typeZone = "un";
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
    profession_fr: classe.value,
    profession_en: classe.value,
    profession_ar: classe.value,
    prix: prix.value,
    ligne_id: x ? x.id : null,
    Etablissement_id: etablissement.id,
    type_validite: typeValidite,
    type_zone: typeZone,
    type_periode: typePeriode,
    type_institut: typeInstitut,
    type_eleve: "eleve",
    type_inscrit: "non-inscrit",
    etat: "En cours",
    active: "1",
  };

  const code = window.localStorage.getItem("code");
  try {
    await axios.put(`https://api.srtk.com.tn/api/abonne/update/${code}`, payload);

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
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  /* Add any margin as needed */
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

.icon-ics:hover {
  /* .ico{
          color:#0053a0;
      } */
}
</style>
