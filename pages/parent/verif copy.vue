<template>
  <div>
    <v-card class="mb-2" v-if="exist === false">
      <v-card-title class="text-h6 mt-4 ml-3">
        demande d'abonnement scolaire de transport urbain
      </v-card-title>
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
        {{ snackbar.message }}
      </v-snackbar>
      <v-card>
        <v-form>
          <v-row class="mb-2 ml-3 mr-3">
            <v-col cols="12" sm="6">
              <v-text-field v-model="cin" color="primary" label="CIN" prepend-inner-icon="mdi-school"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="id_unique" color="primary" label="Identifiant unique"
                prepend-inner-icon="mdi-school"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-btn @click="handleSubmit" class="bt-ics">S'inscrire</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-card>
    <v-card class="mb-2" v-if="exist === true">
      <v-card-title class="text-h6 mt-4 ml-3">
        Informations de l'Utilisateur
      </v-card-title>
      <v-card>
        <v-form>
          <v-row class="mb-2 ml-3 mr-3">
            <v-col cols="12" sm="6">
              <v-text-field v-model="prenom" color="primary" label="Nom & Prénom" disabled
                prepend-inner-icon="mdi-account"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="date_naissance" type="text" color="primary" label="Date de naissance"
                prepend-inner-icon="mdi-calendar-month" disabled></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="etablissement" color="primary" label="Établissement" disabled></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="classe" color="primary" label="Classe" prepend-inner-icon="mdi-school"
                disabled></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="nom_parent" color="primary" label="Parent" prepend-inner-icon="mdi-account-tie"
                disabled></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field type="email" v-model="email" color="primary" label="Email" prepend-inner-icon="mdi-at"
                disabled></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field type="email" v-model="phone" color="primary" label="Téléphone" prepend-inner-icon="mdi-phone"
                disabled></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="adresse" color="primary" label="Adresse" prepend-inner-icon="mdi-map"></v-text-field>
            </v-col>
            <v-card-text style="width: 100%">
              <v-radio-group v-model="semestre">
                <v-row>
                  <v-col cols="12" sm="3">
                    Periode <span class="mdi mdi-play"></span>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="Semestre 1" value="sem1"></v-radio>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="Semestre 2" value="sem2"></v-radio>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="Année" value="an"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-card-text>
            <v-card-text style="width: 100%">
              <v-radio-group v-model="ligne">
                <v-row>
                  <v-col cols="12" sm="3">
                    Validité <span class="mdi mdi-play"></span>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="une Ligne" value="un"></v-radio>
                  </v-col>
                  <v-col cols="6" sm="3">
                    <v-radio label="Toutes les lignes" value="tout"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-card-text>

            <v-card-text v-if="ligne === 'un'" style="width: 100%">
              <v-radio-group v-model="zone">
                <v-row>
                  <v-col cols="12" sm="4">
                    Zone <span class="mdi mdi-play"></span>
                  </v-col>
                  <v-col cols="6" sm="4">
                    <v-radio label="Zone A" value="un"></v-radio>
                  </v-col>
                  <v-col cols="6" sm="4">
                    <v-radio label="Zone B " value="tout"></v-radio>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-card-text>
            <v-col cols="12" sm="6" v-if="ligne === 'un'">
              <v-select label="ligne demandé" :items="lignes.map((item) => item.name)" v-model="select_line"
                item-value="id" item-text="name">
                <template #no-data> Aucun lignes existe </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="12" class="montant" v-if="montant != 0">
              Prix : {{ montant }} Dt<br />
              + 1dt pour le Traitement des candidatures en ligne
            </v-col>
            <v-col cols="12" sm="12">
              <v-col cols="12" sm="6">
                <v-text-field v-model="prix" color="primary" label="Prix"
                  prepend-inner-icon="mdi-currency-eur"></v-text-field>
              </v-col>
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
          </v-row>
        </v-form>
      </v-card>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
import { useAdminStore } from "@/store/auth";

definePageMeta({
  layout: "parent",
});
//const cin = localStorage.getItem('cin');
const adminStore = useAdminStore();
const etablissements = ref([]);
//let cin = ref(adminStore.cin);
let cin = ref("");
retrieveCinFromLocalStorage(); // Retrieve 'cin' from local storage

if (!cin) {
  // Redirect or handle the case when 'cin' is empty
} else {
  saveCinToLocalStorage(); // Save 'cin' to local storage
  asyncFunction();
}

function saveCinToLocalStorage() {
  if (process.client) {
    window.localStorage.setItem("cin", cin);
  }
}

function retrieveCinFromLocalStorage() {
  if (process.client) {
    //cin = window.localStorage.getItem('cin') || '';
  }
}

async function asyncFunction() {
  // Your asynchronous logic goes here
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
    const data = response.data.Lignes.data; // Access the 'data' property within the 'Lignes' object
    lignes.value = data;
  } catch (error) {
    console.error("Error fetching lignes:", error);
  }
}
const filteredEtablissements = computed(() => {
  if (typeetudfac.value === "facpublic") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_College"
    );
  } else if (typeetudfac.value === "facpriv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Prive_Secondaire"
    );
  } else {
    return [];
  }
});

//stagaire
const filteredEtablissementstag = computed(() => {
  if (typeecol.value === "ecolpublic") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Etatique_College"
    );
  } else if (typeecol.value === "ecolpriv") {
    return etablissements.value.filter(
      (item) => item.typeetablissement === "Prive_Secondaire"
    );
  } else {
    return [];
  }
});
// Call fetchEtablissements on component mount
onMounted(() => {
  (async () => {
    await fetchEtablissements();
    await fetchLignes();
  })();
});

const id_unique = ref("");

const exist = ref(false);
const snackbar = ref({
  show: false,
  message: "",
  color: "",
});
const prix = ref("");
const classe = ref("");
const nom = ref("");
const prenom = ref("");
const email = ref("");
const phone = ref("");
const adresse = ref("");
const etablissement = ref("");
const date_naissance = ref("");
const nom_parent = ref("");
const semestre = ref(null);
const ligne = ref(null);
const zone = ref("");
const lignes = ref([]);
const handleSubmit = async () => {
  const payload = {
    cin: cin.value,
    classe: classe.value,
  };

  const resetForm = () => {
    cin.value = "";
    id_unique.value = "";
  };

  try {
    const apiKey =
      "eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJEZWZhdWx0QXBwbGljYXRpb24iLCJpZCI6MSwidXVpZCI6IjE5MjRkNzM4LTc3YzgtNDg2Mi1iMmZiLWE5Yzc3ZDRkZjAwMyJ9LCJpc3MiOiJodHRwczpcL1wvYXBpbS1zdG9yZS5jbmkudG46NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiQnJvbnplIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOm51bGx9LCJVbmxpbWl0ZWQiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH19LCJrZXl0eXBlIjoiU0FOREJPWCIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkF0dGVzdGF0aW9uVHJhdmFpbEVudHJlcHJpc2UiLCJjb250ZXh0IjoiXC9BVEVcLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6Ikxpc3RlVmVoaWN1bGVzUGFyQ2luIiwiY29udGV4dCI6IlwvTGlzdGVWZWhpY3VsZXNcLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlNpdHVhdGlvbkZhbWlsaWFsZVBhckRvbm5lZXNCaW8iLCJjb250ZXh0IjoiXC9TaXR1YXRpb25GYW1pbGlhbGVcLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlZlcmlmaWVyRXhpc3RhbmNlQ2l0b3llbiIsImNvbnRleHQiOiJcL2NpdG95ZW5cLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRldGFpbHNWZWhpY3VsZVBhZUltbWF0IiwiY29udGV4dCI6IlwvRGV0YWlsc1ZlaGljdWxlXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IlVubGltaXRlZCJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJBY3RlUGFyUmVmZXJlbmNlIiwiY29udGV4dCI6IlwvQVJFRlwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiTVNQYXJDaW5EbiIsImNvbnRleHQiOiJcL3NpdHVhdGlvbkZhbWlsaWFsZVwvY2luXC9kblwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiQWN0ZU5haXNzYW5jZUViYXdhYmEiLCJjb250ZXh0IjoiXC9FYmF3YWJhXC9BY3RlTmFpc3NhbmNlXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IlVubGltaXRlZCJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJnZXRVc2VyRnJvbUxEQVAiLCJjb250ZXh0IjoiXC91c2VyXC9sZGFwXC9pZFwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiQWN0ZVBhckNpbkRhdGVOYWlzcyIsImNvbnRleHQiOiJcL2FjdGVcL2NpblwvZGF0ZU5haXNzXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJjaGVja01vYmlsZUlkIiwiY29udGV4dCI6IlwvY2hlY2tNb2JpbGVJZFwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiQWN0TmFpc3NTRkJ5UmVmQWN0QXIiLCJjb250ZXh0IjoiXC9hY3ROYWlzc1wvc2VtaUZpbmFsXC9yZWZBY3RcL2FyXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJjaGVja0RlYXRoQnlDaW5EbiIsImNvbnRleHQiOiJcL2NoZWNrRGVhdGhcL2NpblwvZGF0ZU5haXNzXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJNZW50aW9uc1BhckNpbkRuIiwiY29udGV4dCI6IlwvbWVudGlvbnNcL2NpblwvZG5cLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlZlcmlmaWVyRXhpc3RlbmNlQ2l0b3llblBhckNpbkRuIiwiY29udGV4dCI6IlwvZXhpc3RlbmNlXC9jaXRveWVuXC9jaW5EblwvMi4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIyLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoic3R1ZGVudENlcnRpZmljYXRlIiwiY29udGV4dCI6IlwvY250ZVwvc3R1ZGVudFwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiQWN0ZVBhckRvbm5lZXNCaW8iLCJjb250ZXh0IjoiXC9hY3RlXC9kb25uZWVzQmlvXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9XSwidG9rZW5fdHlwZSI6ImFwaUtleSIsImlhdCI6MTY5MDIwMTQ3NiwianRpIjoiMTIzNzllZTYtNzcxYS00M2I0LWI4MzYtOTdjOTYwMjUzMDc3In0=.ppPlH02PLrgUEmEP0u0JVeJEt6BZOC1ZQ-nMSDGX6yNZW_s4NBaAvF2_ceFcV3jpbZA54jbCq73yrD0_I1n2NfjWr7Wvo5DH4RBCOYf0lIHRishcS7dznE6rVfI1P5eKkEMQoJN1TTdOfjUaEhnnov2sNMkUD6Irdn1Uc2X13OIHHaj0B2_zXqQBNnPjFYke7P3OkLHI8xVEhlFCZo12pmqcMI5KJt7J0Pf-wvsnJZelixVYVfm88z9gWSZm0eCn0pGde5N7f_lPg50tznnX5SF8DhWzgatO-JdNMnY8h135ToPCUKHGxyEhe7oig886lj6qXQ8SduLglijt-Goqww==";
    const params = {
      apikey: apiKey,
    };
    const response = await axios.get(
      `https://apigw.cni.tn/cnte/student/1.0.0/api/cnte/v1/checkEleveByIdCINV2/${cin.value}/${id_unique.value}`,
      { params }
    );
    const responseData = response.data;
    if (responseData.status === true) {
      snackbar.value = {
        show: true,
        message: "Registration successful!",
        color: "success",
      };
      //nom.value = responseData.data.nom;
      prenom.value = responseData.data.prenom + " " + responseData.data.nom;
      etablissement.value = responseData.data.ecole.libele;
      let [datePart, timePart] = responseData.data.date_naissance.split(" ");
      date_naissance.value = datePart;
      //date_naissance.value = responseData.data.date_naissance.split(' ');
      classe.value = responseData.data.niveau.libele;
      exist.value = true;
      resetForm();
    } else {
      snackbar.value = {
        show: true,
        message: responseData.message || "Registration failed!",
        color: "error",
      };
      exist.value = false;
    }
    //console.log(responseData);
  } catch (error) {
    console.error("Registration failed:", error);
  }
  try {
    // Make the API request
    const response = await axios.get(
      `https://api.srtk.com.tn/api/selectparents/${cin.value}`
    );

    // Check if the API call was successful
    if (response.data.success) {
      const parent = response.data.Parent;
      if (parent) {
        // Assuming that "name" and "prenom" are the properties you want to assign
        nom_parent.value = `${parent.name} ${parent.prenom}`;
        email.value = `${parent.email}`;
        phone.value = `${parent.num_telephone}`;
      } else {
        // Handle the case when the "Parent" object is not available in the API response
        console.error("Objet Parent  n'existe pas .");
      }
    } else {
      // Handle the case when the API call was not successful
      console.error("appel API erroné.");
    }
  } catch (error) {
    // Handle any errors that may occur during the API call
    console.error("erreur :", error.message);
  }
};
</script>
