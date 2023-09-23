<template>
  <div>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <v-container>
      <v-card>

        <v-card-title class="text-h6 mt-4 ml-3 text-center" style=";">
          الشؤون الاجتماعية
        </v-card-title>
        <v-responsive>

          <v-radio-group v-model="typabon">
            <v-row style="justify-content: center">
              <v-col cols="6" sm="3">
                <v-radio label="التلميذ" value="eleve"></v-radio>
              </v-col>
              <v-col cols="6" sm="3">
                <v-radio label="طالب" value="etudiant"></v-radio>
              </v-col>

            </v-row>
          </v-radio-group>
        </v-responsive>
        <v-form @submit.prevent="handleSubmit" class="m-3" v-if="typabon === 'etudiant'">
          <v-container>
            <v-row style="width:600px;margin:0 auto;">
              <v-col cols="12" sm="12">
                <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="numCin" :rules="[numCinRule]"
                  :error-messages="numCinErrors" color="primary" label="رقم بطاقة تعريف الطالب"
                  variant="underlined"></v-text-field>
              </v-col>


              <v-col cols="12" sm="12">
                <v-text-field v-model="selectedDate" type="date" color="primary" label="تاريخ ميلاد الطالب"
                  prepend-inner-icon="mdi-calendar-month"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-btn type="submit" color="#1414ff" class="font-weight-medium ml-auto m-3 login text-body-2 next">
                  تسجيل
                </v-btn>
              </v-col>
            </v-row>
          </v-container>


        </v-form>
        <v-form @submit.prevent="handleVerif" class="m-3" v-if="typabon === 'eleve'">
          <v-container>
            <v-row style="width:600px;margin:0 auto;">
              <v-col cols="12" sm="12">
                <v-text-field prepend-inner-icon="mdi-card-account-details-outline" v-model="iduniq" color="primary"
                  label="المعرف الوحيد " variant="underlined"></v-text-field>
              </v-col>


              <v-col cols="12" sm="12">
                <v-text-field v-model="selectedDate" type="date" color="primary" label="تاريخ ميلاد التلميذ"
                  prepend-inner-icon="mdi-calendar-month"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-btn type="submit" color="#1414ff" class="font-weight-medium ml-auto m-3 login text-body-2 next">
                  تسجيل
                </v-btn>
              </v-col>
            </v-row>
          </v-container>


        </v-form>
      </v-card>

    </v-container>
  </div>
</template>
<script>
import { ref, watch } from "vue"; // Ajoutez onMounted
import axios from "axios";

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

    const numCin = ref("");
    const moisNaiss = ref("");
    const iduniq = ref("");
    const showFamilleComponent = ref(false);
    const typabon = ref('eleve');
    const anneeNaiss = ref("");
    const jourNaiss = ref("");




    const resetForm = () => {

      numCin.value = "";



      selectedDate.value = "";

    };

    const numCinRule = [
      (v) =>
        v.length === 8 || "Le champ numCin doit contenir exactement 8 chiffres.",
    ];
    watch(selectedDate, (newDate) => {
      if (newDate) {
        const [annee, mois, jour] = newDate.split("-");
        //console.log("anneeNaiss:", annee);
        // console.log("moisNaiss:", mois);
        //   console.log("jourNaiss:", jour);
        anneeNaiss.value = annee;
        moisNaiss.value = mois;
        jourNaiss.value = jour;
      } else {
        // Réinitialisez les champs si selectedDate est vide
        anneeNaiss.value = "";
        moisNaiss.value = "";
        jourNaiss.value = "";
      }
    });


    const updateDateParts = () => {
      if (selectedDate) {
        const [annee, mois, jour] = selectedDate.split("-");
        anneeNaiss.value = annee;
        moisNaiss.value = mois;
        jourNaiss.value = jour;
      }
    };
    const handleSubmit = async () => {
      if (numCin.value.length !== 8) {
        snackbar.value.message =
          "Le champ numCin doit contenir exactement 8 chiffres.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }


      if (
        !numCin.value ||
        !selectedDate.value

      ) {
        snackbar.value.message =
          "Veuillez remplir tous les champs obligatoires.";
        snackbar.value.color = "error";
        snackbar.value.show = true;
        return; // Stop form submission
      }


      // const payload = {
      // numCin: numCin.value,
      // moisNaiss: moisNaiss.value, // Utilisez la valeur de moisNaiss
      // anneeNaiss: anneeNaiss.value, // Utilisez la valeur de anneeNaiss
      //jourNaiss: jourNaiss.value, // Utilisez la valeur de jourNaiss
      //};

      const payload = new FormData();
      payload.append('numCin', numCin.value);
      payload.append('moisNaiss', moisNaiss.value);
      payload.append('anneeNaiss', anneeNaiss.value);
      payload.append('jourNaiss', jourNaiss.value);

      try {
        const response = await axios.post('https://api.srtk.com.tn/VerifFamilleNecessiteuse.php', payload,
          {
            headers: "Content-Type: application/json"
          }
        );

        //router.push('/famille'); // Assurez-vous que '/famille' est le chemin c
        //resetForm();
        const responseData = response.data;
        if (responseData.codeR === '0') {

          snackbar.value.color = 'error';
          snackbar.value.show = true;
          snackbar.value.message = "citoyen dont le ménage ne fait pas partie des familles nécessiteuses";
        }
        else if (responseData.codeR === '-1') {

          snackbar.value.color = 'error';
          snackbar.value.show = true;
          snackbar.value.message = "citoyen inexistant, ou données erronées";
        }
        else {
          snackbar.value.color = 'error';
          snackbar.value.show = true;
          snackbar.value.message = "citoyen faisant partie d’un ménage";
          router.push('/demande_etud_fm?cin=' + numCin.value + '&nom=' + responseData.nomAr + '&prenom=' + responseData.prenomAr);

        }

      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message.includes('Duplicate entry')) {

        } else {

        }

      }
    };
    ///// id unique eleve
    const handleVerif = async () => {
      console.log('hello');


      const payload = new FormData();
      payload.append('numCin', iduniq.value);
      payload.append('moisNaiss', moisNaiss.value);
      payload.append('anneeNaiss', anneeNaiss.value);
      payload.append('jourNaiss', jourNaiss.value);

      try {
        const response = await axios.post('https://api.srtk.com.tn/checkEligibilityByIdEduDn.php', payload);

        const responseData = response.data;
        let message = "";

        switch (responseData.checkEligibilityBySocialIdResp.codeR) {
          case '0':
            message = "Aucun citoyen trouvé correspondant aux données saisies";
            break;
          case '2':
            message = "Aucun citoyen trouvé correspondant aux données saisies";
            break;
          case '1':
            message = "Succès";
            router.push('/demande_eleve_fm?id_unique=' + iduniq.value + '&nom=' + responseData.checkEligibilityBySocialIdResp.nomAr + '&prenom=' + responseData.checkEligibilityBySocialIdResp.prenomAr);
            break;
          default:
            message = "Erreur technique";
        }

        snackbar.value = {
          show: true,
          message,
          color: 'error'
        };
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message.includes('Duplicate entry')) {
          // Handle specific error
        } else {
          // Handle other errors
        }
      }
    };


    const numCinErrors = () => {
      const errors = [];
      if (numCin.value.length !== 8) {
        errors.push("Le champ numCin doit contenir exactement 8 chiffres.");
      }
      return errors;
    };



    const getJours = () => {
      // Générez la liste des jours du mois
      return Array.from({ length: 31 }, (_, i) => String(i + 1));
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

      numCin,
      typabon,

      iduniq,
      resetForm,
      numCinRule,
      handleSubmit,
      handleVerif,

      numCinErrors,
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

