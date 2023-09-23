<template>
<v-container class="cont">
	<v-card style="padding:40px;" >
		<div class="col-md-12">   
			<v-text class="title" >Comment s'inscrire à distance aux abonnements scolaires et universitaires</v-text>
			<v-text class="sub">Veuillez saisir les données en arabe </v-text>
			<v-text > Cliquez sur le bouton <b>s'inscrire</b></v-text>
			<v-text > Sélection de la qualité (étudiant, étudiant, apprenti ou stagiaire)</v-text>
			<v-text>Remplir le formulaire pour obtenir un abonnement scolaire :</v-text>
			<v-list>
			
				<v-list-item> 
<span class="mdi mdi-check-underline-circle"></span> Nom et Prénom</v-list-item>
				<v-list-item> 
<span class="mdi mdi-check-underline-circle"></span> Date de naissance</v-list-item>
				<v-list-item> 
<span class="mdi mdi-check-underline-circle"></span> Email</v-list-item>
				<v-list-item> 
<span class="mdi mdi-check-underline-circle"></span> Numéro de carte d'étudiant (Le numéro de carte d'identité du tuteur pour ceux qui n'ont pas de carte d'identité)</v-list-item>
				<v-list-item> 
<span class="mdi mdi-check-underline-circle"></span> Date d'émission</v-list-item>
<v-list-item> <span class="mdi mdi-check-underline-circle"></span> Adresse de résidence</v-list-item>
<v-list-item> <span class="mdi mdi-check-underline-circle"></span> Numéro de téléphone portable (vous recevrez un court message vous informant du numéro d'abonnement, de la date de réception, du lieu de réception et du numéro du guichet)</v-list-item>	
			</v-list>
			<v-text class="tit-center">L'application qui contient l'identifiant (marqué en rouge) doit être conservée.</v-text>
		</div>
    <div class="col-md-12">   



<br>
</div><br>
<div class="d-flex justify-space-around btn">   
	<router-link to="/abonnement_ordinaire">
	<v-btn  class="bt-ics">S'inscrire</v-btn>
</router-link>
<router-link to="/recevoir">
	<v-btn class="bt-ics"> recevoir </v-btn>
</router-link>
<router-link to="/renouvellement">
<v-btn class="bt-ics">renouvellement </v-btn>
</router-link>

	<router-link to="/imprimer">
	<v-btn class="bt-ics"> Imprimer </v-btn>
	</router-link>	
		<router-link to="/recuperer">
		<v-btn class="bt-ics">  Recuperer code abonnement </v-btn>
			</router-link>
</div>
<br>
  </v-card>
</v-container>
</template>
<script>
definePageMeta({
    layout: "p",
});

export default {
mounted(){
    this.$nextTick(() => {
      this.$pagename = "Abonnement urbain ordinaire"; // Mettez à jour la valeur de la variable globale
      const titleElement = document.getElementById("title");
      
        titleElement.innerText = this.$pagename; // Mettez à jour le contenu de la balise avec l'id "title"
      
    });
    }}
</script>
<style>

p .color{    color: rgb(54 145 214);}
.colorred{color:red}
div .btn button{
	font-size:19px;
}
.title{font-size:20px;
	color: rgb(54 145 214);
}
v-text{display:block;}
.sub{
	color:red;
	font-size:18px;
}
.tit-center{
text-align: center;
font-size: 18px;
font-weight: 600;
color:red
}
.tit-center-light{
	text-align: center;
font-size: 16px;
font-weight: 600;
color:red;
line-height: 30px;
}
.bt-ics{
font-size:14px !important;
text-transform: capitalize;
background: linear-gradient(to top, #0053a0, #3182ce) !important;
color:white;
}
.bt-ics:hover{
	background: linear-gradient(to bottom, #0053a0, #4aa2f5) !important;
color:white;

}
</style>
