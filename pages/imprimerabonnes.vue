<template>
  <div class="center-content">
    <v-btn @click="fetchAbonnementDataAndPrint" class="bt-ics">Imprimer Abonnement</v-btn>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import QRCode from "qrcode";

definePageMeta({
  layout: "p",
});
// Define refs for data

const num_telephone = ref("");
const nom_parent = ref("");
const image_url = ref("");
const type_periode = ref("");
const date_naissance = ref("");
const date_emission = ref("");
const code = ref("");
const prenom = ref("");
const adresse = ref("");
const cin = ref("");
const type_abonne = ref("");
const prix = ref("");
const src = ref("");
const type_paiment = ref("");
const date_paiement = ref("");
const etat = ref("");
const qrCodeElement = ref(null);
const etab = ref("");
onMounted(() => {

  fetchAbonnementDataAndPrint();
})
// Fetch and print abonnement data
async function fetchAbonnementDataAndPrint() {
  try {
    // Replace with your API endpoint
    const urlParams = new URLSearchParams(window.location.search);
    const codd = urlParams.get('code');
    const response = await axios.get(
      `https://api.srtk.com.tn/api/abonnes?code=${codd}`
    );

    if (response.status === 200) {
      const abonnement = response.data.abonnes.data[0];

      // Update refs with fetched data

      num_telephone.value = abonnement.num_telephone;
      prenom.value = abonnement.prenom;
      nom_parent.value = abonnement.nom_parent;
      type_periode.value = abonnement.type_periode; // Set the URL of the image
      date_emission.value = abonnement.date_emission;
      date_naissance.value = abonnement.date_naissance;
      code.value = abonnement.code;
      cin.value = abonnement.cin;
      type_abonne.value = abonnement.type_abonne;
      adresse.value = abonnement.adresse;
      prix.value = abonnement.prix;
      src.value = abonnement.src;
      type_paiment.value = abonnement.type_paiment;
      date_paiement.value = abonnement.date_paiement;
      etab.value = abonnement.classe;
      etat.value = abonnement.etat;
      // Generate the QR code

      await generateQRCode(code.value);

      // Print abonnement data
      await printAbonnement();
    } else {
      console.error("Error fetching subscription data");
    }
  } catch (error) {
    console.error("Error fetching subscription data", error);
  }
}
async function generateQRCode(text) {
  try {
    const opts = {
      width: 800,
      margin: 2,
    };
    const canvas = await QRCode.toCanvas(text, opts);
    image_url.value = canvas.toDataURL(); // Update the image_url directly
  } catch (error) {
    console.error("Error generating QR code", error);
  }
}

async function printAbonnement() {
  // Create a new window to display the printable content
  const printWindow = window.open("", "_blank");
  await generateQRCode(code.value); // Use code.value directly

  // Generate the HTML content for printing
  const printContent = `
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>الشركة الجهوية للنقل بولاية القصرين إدارة الاستغلال المصلحة التجارية</title>
    <style>
        /* Nouveau style pour le QR code */
        .qr-code-container {
            position: absolute;
            bottom: 20px;
            left: 20px;
            text-align: left;
        }

        .qr-code {
            max-width: 100px;
        }
        
        /* Centrer le titre */
        .centered-title {
            text-align: center;
        }
        
        /* Affichage parallèle des valeurs */
        .values-container {
            display: flex;
            justify-content: space-between;
        }
        /* Style pour le titre multiligne */
        .multiline-title {
            text-align: center;
            white-space: pre-line;
        }
        /* Affichage des champs côte à côte */
        .fields-container {
            display: flex;
            justify-content: space-between;
        }
        
        /* Affichage des champs côte à côte */
        .fiel-container {
            display: flex;
            justify-content: space-between;
        }
        /* Style pour le texte en haut à droite */
        .header-text {
            text-align: right;
            font-size: 12px; /* Taille de police plus petite */
            margin: 10px 20px; /* Espacement autour du texte */
             white-space: pre-line; 
        }
        
        /* Style pour le champ "code" */
        .code-container {
            color: red;
            border: 1px solid red;
            padding: 2px 5px;
            border-radius: 5px;
            display: inline-block;
             margin-bottom: 10px;
        }
         .prix-container {
    text-align: center; /* Aligner le texte au centre */
    margin-top: 250px; /* Espacement par rapport aux éléments précédents */
}
        .signature-container {
           text-align: left; /* Aligner le texte à gauche */
           margin-top: 20px; /* Espacement par rapport aux éléments précédents */
       }
       .processing-info {
        text-align: center; /* Aligner le texte au centre */
       margin-top: 20px; /* Espacement par rapport aux éléments précédents */
       margin-bottom: 20px; /* Espacement par rapport aux éléments suivants */
        }
          .image-container {
            position: absolute;
            top: 20px; /* Ajustez la valeur selon vos besoins */
            left: 20px; /* Ajustez la valeur selon vos besoins */
            width: 100px;
            height: auto;
        }
        .signature-etab-container{
          float:right;
          margin-top:-50px;
        }
    </style>
</head>
<body>
<div class="image-container">
        <img src="https://api.srtk.com.tn/${src.value
    }" alt="Image d'abonné" style="max-width: 100%; max-height: 100%; object-fit: contain;">
    </div>

     <!-- Texte en haut à droite -->
    <div class="header-text">
        <p dir="rtl">الشركة الجهوية للنقل بولاية القصرين إدارة الاستغلال المصلحة التجارية</p>
    </div>
    
      <h1 dir="rtl" class="multiline-title">مطلب الحصول على إشتراك عادي نقل جهوي\nالسنة الإدارية</h1>
    <!-- Affichage parallèle des valeurs -->
    <div class="values-container">
        <p dir="rtl"><strong>القسم :</strong> ${etab.value}</p>
       
        <p dir="rtl"><strong>رقم بطاقة التعريف الوطنية:</strong> ${cin.value
    }</p>
    </div>
    
    <!-- Affichage côte à côte des champs "الإسم و اللقب" et "تاريخ الولادة" -->
    <div class="fields-container">
        <p dir="rtl"><strong>الإسم و اللقب :</strong> ${prenom.value}</p>
        <p dir="rtl"><strong>تاريخ الولادة :</strong> ${date_naissance.value
    }</p>
    </div>
    
    <!-- Affichage côte à côte des champs "عنوان السكن" et "رقم الهاتف" -->
    <div class="fiel-container">
        <p dir="rtl"><strong> عنوان السكن :</strong> ${adresse.value}</p>
        <p dir="rtl"><strong>رقم الهاتف :</strong> ${num_telephone.value}</p>
    </div>
 
     
        <!-- Affichage du champ "طريقة الخلاص" avec des boutons radio -->
<div class="fiel-container">
    <p dir="rtl"><strong>طريقة الخلاص :</strong></p>
    <label dir="rtl">
        <input type="radio" name="type_periode" value="سداسي" ${type_periode.value !== "an" ? "checked" : ""
    }> سداسي
    </label>
    <label dir="rtl">
        <input type="radio" name="type_periode" value=" سنوي" ${type_periode.value === "an" ? "checked" : ""
    }> سنوي
    </label>
</div>
<!-- Affichage du champ "نوعية الإشتراك" avec des boutons radio -->
<div class="fiel-container">
    <p dir="rtl"><strong>نوعية الإشتراك :</strong> ${type_paiment.value}</p>
    <!--<label dir="rtl">
        <input type="radio" name="type_abonne" value="شخصي" ${type_abonne.value === "personel" ? "checked" : ""
    }> شخصي
    </label>
    <label dir="rtl">
        <input type="radio" name="type_abonne" value="غير شخصي" ${type_abonne.value !== "personel" ? "checked" : ""
    }> غير شخصي
    </label>-->
</div>


    
    <!-- Champ "code" en rouge et encadré en rouge -->
    <div class="code-container">
      المعرف :  ${code.value}
    </div>
    <br>
      <!-- Champ "code" en rouge et encadré en rouge -->
    <div class="code-container">
        ${etat.value === 'En cours' ? "غير مدفوعة" : ""
    }
     ${etat.value === 'paye' ? "مدفوعة" : ""
    }
     ${etat.value === 'paye ch' ? "مدفوعة ش.أ" : ""
    }

    </div>

  <!-- Texte "إمضاء المشترك" à gauche en dessous -->
<div class="signature-container">
    <p dir="rtl"><strong>إمضاء المشترك</strong></p>
</div>

<div class="signature-etab-container">
    <p dir="rtl"><strong> إمضاء المؤسسة التربوية </strong></p>
</div>
 <div class="prix-container">
    <p dir="rtl"><strong>	قيمة الإشتراك  :</strong> ${prix.value - 4}</p>
</div>
<!-- Texte "معلوم معالجة المطلب عبر الأنترنت 1,000 ثمن البطاقة 3,000" -->
<div class="processing-info">
    <p dir="rtl">معلوم معالجة المطلب عبر الأنترنت 1,000 ثمن البطاقة 3,000</p>
</div>
    <div class="qr-code-container">
        <img class="qr-code" src="${image_url.value}" alt="QR Code">
    </div>
</body>

</html>






`;
  // Write the content to the new window and close it
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait a bit before triggering the print to ensure content is loaded
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Trigger the print
  printWindow.print();
}

</script>
<style>
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Ajustez la hauteur en fonction de vos besoins */
}

.centered-title {
  text-align: center;
}

/* Nouveau style pour encadrer avec une bordure rouge */
.red-bordered {
  border: 2px solid red;
  padding: 5px;
  /* Ajoutez un peu d'espacement pour un meilleur aspect */
}

.styled-input {
  border: 1px solid #ccc;
  /* Example border style */
  padding: 5px;
  /* Add some padding for spacing */
  width: 100%;
  /* Adjust the width as needed */
}

/* Style pour le conteneur de signature */
</style>
