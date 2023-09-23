<template>
  <v-container dir="rtl">
    <v-row>
      <v-col>
        <v-card class="card-shadow" :class="typabon === 'eleve' ? 'eleve' : 'non-eleve'">
          <v-card-title class="text-center" style="font-size: 17px">
            طلب اشتراك في نقل المدارس الحضري
            <br>
            <p style="color:red"> Veuillez saisir les données en arabe <br>
              الرجاء إدخال البيانات باللغة العربية
            </p>
          </v-card-title>
          <v-card-subtitle class="text-center">السنة الدراسية: {{ currentYear }}-{{
            currentYear + 1
          }}</v-card-subtitle>
          <br />
          <v-card>
            <v-form>
              <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color" top>{{ snackbar.message
              }}</v-snackbar>
              <v-row class="form">
                <v-col cols="12" sm="6">
                  <v-text-field v-model="prenom" color="primary" label="الاسم واللقب"
                    prepend-inner-icon="mdi-account"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">

                  <ImageUpload @uploaded="image = $event" />
                  <v-img :src="'https://api.srtk.com.tn/' + image" width="170"></v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="adresse" color="primary" label="العنوان"
                    prepend-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_naissance" type="date" color="primary" label="تاريخ الميلاد"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="cin" prepend-inner-icon="mdi-card-account-details-outline"
                    label="أدخل رقم بطاقة التعريف" :rules="[cinRule]" :error-messages="cinErrors" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="date_emission" type="date" color="primary" label="تاريخ تسليم بطاقة التعريف"
                    prepend-inner-icon="mdi-calendar-month"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field type="email" v-model="email" color="primary" label="البريد الإلكتروني"
                    prepend-inner-icon="mdi-at"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="num_telephone" color="primary" type="numéro" label="الهاتف"
                    prepend-inner-icon="mdi-phone"></v-text-field>
                </v-col>

                <v-text-field v-model="nom_parent" color="primary" style="display: none" label="الوالد"
                  prepend-inner-icon="mdi-account-tie"></v-text-field>

                <v-text-field v-model="classe" color="primary" style="display: none" label="الصف"
                  prepend-inner-icon="mdi-school"></v-text-field>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="profession" color="primary" label="المهنة"
                    prepend-inner-icon="mdi-account-tie"></v-text-field>
                </v-col>
                <v-card-text style="width: 100%">
                  <v-radio-group v-model="typeAbonne">
                    <v-row>
                      <v-col cols="12" sm="4">
                        نوع الاشتراك <span class="mdi mdi-play"></span>
                      </v-col>
                      <v-col cols="6" sm="4">
                        <v-radio label="شخصي" value="personel"></v-radio>
                      </v-col>
                      <v-col cols="6" sm="4">
                        <v-radio label="غير شخصي" value="impersonnel"></v-radio>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-card-text>

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
                      المنطقة <span style="color: red">*</span>
                      <span class="mdi mdi-play"></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                      <select v-model="selectedGareId" class="forms" autocomplete
                        @change="fetchAbonnesligne(selectedGareId)">
                        <option value="">اختر منطقة</option>
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
                        <option value="">اختر الخط</option>
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

                <v-col cols="12" sm="12" class="montant" v-if="prix != 0">
                  {{ typ_yes }}<br />
                  الثمن: {{ prix }} دينار<br />
                  + 3 دينار لمعالجة طلبات التسجيل عبر الإنترنت
                </v-col>
                <v-col cols="12" sm="12">
                  <div>
                    <div v-if="!paymentSessionId">
                      <v-btn @click="handleRegistration" class="bt-ics">سجل</v-btn>
                    </div>

                    <!-- قسم الدفع -->
                    <div v-else>
                      <div class="btn-container">
                        <v-btn color="primary" @click="redirectToPaymentPage">الانتقال إلى صفحة الدفع</v-btn>
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

import { ref, onMounted } from "vue";
import axios from "axios";

definePageMeta({
  layout: "p",
});
const csrf_token = ref(null);
const csrfToken = ref(null);
const type_abonne = ref("scolaire");
const image = ref("");
const select_prix = ref("");
const garess = ref([]);
const selectedGareId = ref("");
const date_debut = ref("");
const date_fin = ref("");
const typ_yes = ref("");
const gare = ref("");
const typetudfac = ref(null);
const enabled = ref(false);

const typetud = ref("non-inscrit");
const typeetudfac = ref(null);
const semestre = ref(null);
const ligne = ref(null);
const typabon = ref(null);
const typeAbonne = ref(null);
const typePaiement = ref(null);

const zone = ref("");
const montant = ref(0);
const profession = ref("");
const selected = ref(null);
const select_line = ref("");
const etablissements = ref([]);
const gares = ref([]);
const lignes = ref([]);
const prix = ref(0);
const price = ref(0);
const password = ref("");
const email = ref("");
const num_telephone = ref("");
const date_naissance = ref("");
const date_emission = ref("");
const cin = ref("");
const prenom = ref("");
const adresse = ref("");
const classe = ref("");
const nom_parent = ref("");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const currentYear = ref(new Date().getFullYear());
const showSnackbar = ref(false);
const snackbarMessage = ref("");
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
  select_line.value = '';
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
    try {
      const response = await axios.get(
        "https://api.srtk.com.tn/api/abonneprix/show/" + idd.value
      );
      const newPrice = 3 + parseFloat(response.data.tarif.prix);

      // Mettez à jour la valeur de la variable price
      price.value = newPrice;
      typ_yes.value = response.data.tarif.nom;
      return (prix.value = response.data.tarif.prix);
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
  console.log(paymentSessionId.value);
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
    return data;
  } catch (error) {
    console.error("Error fetching lignes:", error);
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
    //console.error("Error fetching lignes:", error);
  }
}
onMounted(async () => {
  await fetchgares();
  await fetchEtablissements();
  await fetchLignes();
  await fetchAbn();
});

const resetForm = () => {
  password.value = "";
  email.value = "";
  num_telephone.value = "";
  date_naissance.value = "";
  date_emission.value = "";
  cin.value = "";
  prenom.value = "";
  profession.value = "";
  adresse.value = "";
  nom_parent.value = "";
  classe.value = "";
  selected.value = "";
  select_line.value = "";
  typeAbonne.value = "";
  typePaiement.value = "";
  prix.value = "";
  image.value = "";
};

const handleRegistration = async () => {
  customer.fname = prenom.value;
  customer.lname = nom_parent.value;
  customer.adresse = adresse.value;
  customer.email = email.value;
  customer.phone = num_telephone.value;
  order.amount = prix.value;
  const requiredFields = [
    cin.value,
    num_telephone.value,
    email.value,
    date_naissance.value,

    prenom.value,
    profession.value,
    select_line.value,
    selectedGareId.value,
    prix.value,
  ];
  //console.log("cin", cin.value);
  const isAllFieldsFilled = requiredFields.every((field) => !!field);

  if (!isAllFieldsFilled) {
    snackbar.value = {
      show: true,
      message: "Veuillez remplir tous les champs.",
      color: "error",
    };
    return; // Stop further execution
  }
  if (!cin.value || cin.value.length !== 8) {
    snackbar.value.message =
      "Le champ CIN doit contenir exactement 8 chiffres.";
    snackbar.value.color = "error";
    snackbar.value.show = true;
    return; // Stop form submission
  }

  if (num_telephone.value.length !== 8) {
    snackbar.value.message =
      "Le champ numero de telnum_telephone doit contenir exactement 8 chiffres.";
    snackbar.value.color = "error";
    snackbar.value.show = true;
    return; // Stop form submission
  }
  if (!image.value || cin.value.length === 0) {
    snackbar.value = {
      show: true,
      message: "Veuillez charger votre photo",
      color: "error",
    };
    return; // Stop further execution
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

  let type_validite = null;

  if (ligne.value === "un") {
    type_validite = "un";
  } else if (ligne.value === "tout") {
    type_validite = "tout";
  }

  let type_paiment = null;

  if (typePaiement.value === "annuel") {
    type_paiment = "annuel";
  } else if (typePaiement.value === "mensuel") {
    type_paiment = "mensuel";
  }

  let type_abonne = null;

  if (typeAbonne.value === "personel") {
    type_abonne = "personel";
  } else if (typeAbonne.value === "impersonnel") {
    type_abonne = "impersonnel";
  }

  let type_zone = null;

  if (zone.value === "un") {
    type_zone = "un";
  } else if (zone.value === "deux") {
    type_zone = "deux";
  } else if (zone.value === "trois+") {
    type_zone = "trois+";
  }
  try {

    const etablissement = etablissements.value.find(
      (item) => item.labelle === selected.value
    );
    const x = lignes.value.find((item) => item.name === select_line.value);

    const payload = {
      email: email.value,
      cin: cin.value,
      num_telephone: num_telephone.value,
      date_naissance: date_naissance.value,
      date_emission: date_emission.value,
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
      profession_fr: profession.value,
      profession_en: profession.value,
      profession_ar: profession.value,
      ligne_id: ligne.value,
      type_periode: semestre.value,
      Etablissement_id: etablissement.id,
      type_zone: selectedGareId.value,
      type_validite: type_validite,
      type_abonne: type_abonne,
      type_paiment: typ_yes.value,
      prix: prix.value,
      etat: 'En cours',
      image: image.value,
      orderid: num_order,
    };

    try {
      console.log(num_order);
      await axios.post("https://api.srtk.com.tn/api/abonne/add", payload);
      snackbar.value = {
        show: true,
        message: "Inscription réussie !",
        color: "success",
      };
      await createSession();

      // Redirect to the payment page if a payment session ID was successfully generated
      if (paymentSessionId.value) {
        //  redirectToPaymentPage(); // Only call this function here
      } else {
        // Handle the case where the payment session ID is not generated
        // console.error("Payment Session ID is missing or not generated.");
        // You can show an error message or perform other actions here if needed.
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle the error, show a message, or perform other actions if needed.
    }
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
  /* .ico {
        color: #0053a0;
    } */
}

select {
  width: 100%;
  background-color: #f6f6f6;
  padding: 12px;
  border-radius: 5px;
  border: 0.3px solid #9f9f9f;
}
</style>
