<template>
  <div>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
    <v-container>
      <v-card title="Inscription Parent" subtitle="Inscription">
        <v-form @submit.prevent="handleSubmit" class="m-3">
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="cin" :rules="[cinRule]"
                  :error-messages="cinErrors" color="primary" label="Numéro CIN" variant="underlined"
                  disabled></v-text-field>
              </v-col>


              <v-col cols="12" sm="6">
                <v-text-field v-model="selectedDate" type="text" color="primary" label="تاريخ الميلاد"
                  prepend-inner-icon="mdi-calendar-month" disabled></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field prepend-inner-icon="mdi-account" v-model="prenom" color="primary" label="Prenom"
                  variant="underlined" disabled></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field prepend-inner-icon="mdi-account" v-model="name" color="primary" label="name"
                  variant="underlined" disabled></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field type="email" required prepend-inner-icon="mdi-at" v-model="email" color="primary"
                  label="Email" variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-text-field prepend-icon="mdi-phone" v-model="num_telephone" :rules="[phoneRule]"
                  :error-messages="phoneErrors" color="primary" label="Numero de Telephone"
                  variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="password" prepend-inner-icon="mdi-lock-outline" required type="password"
                  color="primary" label="Mot de passe" variant="underlined" :rules="[passwordRule]"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model="password_confirm" prepend-inner-icon="mdi-lock-outline" required type="password"
                  color="primary" label="Confirmer mot de passe" variant="underlined"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-btn type="submit" color="#1414ff" class="font-weight-medium ml-auto m-3 login text-body-2 next">
            S'inscire
          </v-btn>

        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAdminStore } from "@/store/auth";
import { useRouter } from "vue-router"; // Import useRouter
definePageMeta({
  layout: "p",
});
export default {
  setup() {
    const router = useRouter();
    const snackbar = ref({
      show: false,
      message: "",
      color: "",
    });
    const selectedDate = ref("");
    const prenom = ref("");
    const name = ref("");
    const email = ref("");
    const cin = ref("");
    const mois_naissance = ref("");
    const num_telephone = ref("");
    const password = ref("");
    const annee_naissance = ref("");
    const jour_naissance = ref("");
    const password_confirm = ref("");

    const resetForm = () => {
      prenom.value = "";
      name.value = "";
      email.value = "";
      cin.value = "";

      num_telephone.value = "";
      password.value = "";
      selectedDate.value = "";
      password_confirm.value = "";
    };

    const cinRule = [
      (v) =>
        v.length === 8 || "Le champ CIN doit contenir exactement 8 chiffres.",
    ];
    const phoneRule = [
      (v) => v.length === 8 || "Le champ doit contenir exactement 8 chiffres.",
    ];
    const passwordRule = [
      (v) =>
        (v && v.length >= 6) ||
        "Le mot de passe doit contenir au moins 6 caractères.",
    ];

    onMounted(async () => {
      const params = new URLSearchParams(window.location.search);

      const cins = params.get('cin');
      cin.value = cins;
      const jr = params.get('jr');
      const mm = params.get('mm');
      const an = params.get('an');

      const formdata = new FormData();
      formdata.append("numCin", cins);
      formdata.append("jourNaiss", jr);
      formdata.append("moisNaiss", mm);
      formdata.append("anneeNaiss", an);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };

      try {
        const response = await fetch("https://api.srtk.com.tn/checkcitoyen.php", requestOptions);
        const result = await response.json();

        if (result.codeR === '1') {
          // Rediriger vers /inscription1

          selectedDate.value = an + '-' + mm + '-' + jr;
          prenom.value = result.prenomAr;
          name.value = result.nomAr;
          email = ref("");
          mois_naissance = ref("");
          annee_naissance = ref("");
          jour_naissance = ref("");

        } else if (result.codeR === '0') {
          // Rester sur la même page (peut-être afficher un message d'erreur)
          console.log("Aucun citoyen trouvé");
        } else {
          // Gérer les autres cas ici
        }
      } catch (error) {
        //console.error('Erreur lors de l\'appel de l\'API :', error);
        // Gérer les erreurs de l'appel à l'API ici
      }
    });
    const updateDateParts = () => {
      if (selectedDate) {
        const [annee, mois, jour] = selectedDate.split("-");
        annee_naissance.value = annee;
        mois_naissance.value = mois;
        jour_naissance.value = jour;
      }
    };
    const handleSubmit = async () => {
      if (cin.value.length !== 8) {
        snackbar.value.message =
          "Le champ CIN doit contenir exactement 8 chiffres.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }
      if (password.value.length < 6) {
        snackbar.value.message =
          "Le mot de passe doit contenir au moins 6 caractères.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }

      if (num_telephone.value.length !== 8) {
        snackbar.value.message =
          "Le champ numero de telphone doit contenir exactement 8 chiffres.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }
      if (
        !cin.value ||
        !selectedDate.value ||
        !prenom.value ||
        !name.value ||
        !num_telephone.value ||
        !password.value ||
        !password_confirm.value
      ) {
        snackbar.value.message =
          "Veuillez remplir tous les champs obligatoires.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }
      if (password.value !== password_confirm.value) {
        snackbar.value.message = "Les mots de passe ne correspondent pas.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }
      const payload = {
        prenom_fr: prenom.value,
        prenom_ar: prenom.value,
        prenom_en: prenom.value,
        name_fr: name.value,
        name_ar: name.value,
        name_en: name.value,
        email: email.value,
        cin: cin.value,

        num_telephone: num_telephone.value,
        password: password.value,
        mois_naissance: selectedDate.value,
        annee_naissance: selectedDate.value,
        jour_naissance: selectedDate.value,
        password_confirm: password_confirm.value,
      };

      try {
        //        await axios.post("https://api.srtk.com.tn/api/parent/add", payload, { cin: cin.value });
        await axios.post("https://api.srtk.com.tn/api/parent/add", payload, { cin: cin.value });

        snackbar.value.message = "Inscription réussie !";
        snackbar.value.color = "success";
        snackbar.value.show = true;


        //        //console.log('ecc', cin.value)
        const adminStore = useAdminStore();
        adminStore.setCin(cin.value);
        router.push(`/sms?cin=${cin.value}`);
        resetForm();
      } catch (error) {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message.includes("Duplicate entry")
        ) {
          if (error.response && error.response.status === 200) {
            snackbar.value.message = "Inscription réussie !";
            snackbar.value.color = "success";
            snackbar.value.show = true;

          } else if (
            error.response.data.message.includes("parents_email_unique")
          ) {
            snackbar.value.message = "L'adresse email est déjà utilisée.";
          }
        } else {
          snackbar.value.message = "Le CIN est déjà utilisé..";
        }
        snackbar.value.color = "error";
        snackbar.value.show = true;
      }
    };

    const cinErrors = () => {
      const errors = [];
      if (cin.value.length !== 8) {
        errors.push("Le champ CIN doit contenir exactement 8 chiffres.");
      }
      return errors;
    };

    const phoneErrors = () => {
      const errors = [];
      if (num_telephone.value.length !== 8) {
        errors.push("Le champ doit contenir exactement 8 chiffres.");
      }
      return errors;
    };

    const getJours = () => {
      if (mois_naissance.value && annee_naissance.value) {
        const joursDansMois = new Date(
          annee_naissance.value,
          mois_naissance.value,
          0
        ).getDate();
        return Array.from({ length: joursDansMois }, (_, i) => String(i + 1));
      }
      return [];
    };

    const getMois = () => {
      return Array.from({ length: 12 }, (_, i) => String(i + 1));
    };

    const getAnnees = () => {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 100 }, (_, i) => String(currentYear - i));
    };


    return {
      snackbar,
      prenom,
      name,
      email,
      cin,

      num_telephone,
      password,

      password_confirm,
      resetForm,
      cinRule,
      phoneRule,
      passwordRule,
      handleSubmit,
      cinErrors,
      phoneErrors,
      getJours,
      getMois,
      getAnnees,
      selectedDate,
    };
  },
};
</script>

<style>
.next {
  color: white;
  border-radius: 5px;
}
</style>