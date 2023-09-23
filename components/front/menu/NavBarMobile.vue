


<template>

   
    <v-app-bar  color="secondary d-flex d-md-none d-none d-sm-flex">
        <v-progress-linear :active="true" :indeterminate="false" absolute bottom color="white"></v-progress-linear>
        <v-app-bar-nav-icon class=" " @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>

        <!-- <v-toolbar-title>SRTK</v-toolbar-title> -->

     

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-container class="align-start c-menu-navbar text-white ">

<NuxtLink to="/"><v-btn :rounded="0" variant="plain" class="btn-nav">Acceuil</v-btn></NuxtLink>

<v-btn :rounded="0" variant="plain" class="btn-nav">
    srtk
    <v-menu activator="parent" open-on-hover>
        <v-list>

            <NuxtLink :to="item.link" v-for="(item, index) in srtk" :key="index" :value="index">
                <v-list-item>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </NuxtLink>

        </v-list>
    </v-menu>
</v-btn>

<v-btn :rounded="0" variant="plain" class="btn-nav">
    Abonnement
    <v-menu activator="parent" open-on-hover>
        <v-list>

            <NuxtLink :to="item.link" v-for="(item, index) in abonnement" :key="index" :value="index">
                <v-list-item>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </NuxtLink>
        </v-list>
    </v-menu>
</v-btn>
<v-btn :rounded="0" variant="plain" class="btn-nav">
    Réservation
    <v-menu activator="parent" open-on-hover>
        <v-list>
            <NuxtLink :to="item.link" v-for="(item, index) in reservation" :key="index" :value="index">
                <v-list-item>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </NuxtLink>

        </v-list>
    </v-menu>
</v-btn>
<v-btn :rounded="0" variant="plain" class="btn-nav">
    Communication
    <v-menu activator="parent" open-on-hover>
        <v-list>
            <NuxtLink :to="item.link" v-for="(item, index) in communication" :key="index" :value="index">
                <v-list-item>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </NuxtLink>
        </v-list>
    </v-menu>
</v-btn>
<v-btn :rounded="0" variant="plain" class="btn-nav">
    Galerie
    <v-menu activator="parent" open-on-hover>
        <v-list>
            <NuxtLink :to="item.link" v-for="(item, index) in galerie" :key="index" :value="index">
                <v-list-item>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </NuxtLink>
        </v-list>
    </v-menu>
</v-btn>
<v-btn :rounded="0" variant="plain" class="btn-nav">
    a propos
    <v-menu activator="parent" open-on-hover>
        <v-list>
            <NuxtLink :to="item.link" v-for="(item, index) in apropos" :key="index" :value="index">
                <v-list-item>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </NuxtLink>
        </v-list>
    </v-menu>
</v-btn>

<v-btn :rounded="0" variant="plain" class="btn-nav">
    <NuxtLink to="/contact">Contact</NuxtLink>
</v-btn>
<v-spacer></v-spacer>

</v-container>

    </v-navigation-drawer>
</template>

<script>
export default {
    mounted() {
        this.isMobile = this.$vuetify.display.mobile
    },
    data: () => ({
        isMobile: false,
        drawer: null,
        srtk: [
            { title: 'Présentation', link: "presentation" },
            { title: 'Récrutemens', link: "recrutement" },
            { title: 'Qualité', link: "qualite" },
            { title: 'Sécurité', link: "securite" },
        ],
        Presentation: [
            { title: 'Présentation Générale', link: "presentation-gen" },
            { title: 'Moyen et trafics', link: "moyen-trafics" },
            { title: 'Les investissements', link: "investissements" },
        ],
        abonnement: [
            { title: 'Urbain', link: "urbain" },
            { title: 'Régional', link: "regional" },
        ],
        reservation: [
            { title: 'Réservation Ticket', link: "reservation" },
            { title: 'Horaires Régionaux et Interurbain', link: "horaire" },
        ],
        communication: [
            { title: "Accès à l'information", link: "accee-information" },
            { title: "Appel d'offres", link: "appel-doffre" },
            { title: 'Communication média', link: "communication-media" },
        ],
        galerie: [
            { title: 'Photos', link: "photos" },
            { title: 'Videos', link: "videos" },
        ],
        apropos: [
            { title: 'Actualités', link: "actualite" },
            { title: 'Évenements', link: "evenement" },
            { title: 'Activités', link: "activite" },
        ],

    }),
}
</script>

<style lang="scss" scoped>

.btn-lang {
    cursor: pointer;
}

.c-menu-navbar {
    button {
        padding-top: 10px;
        padding-bottom: 10px;
        color:#000;


        &:hover {
            background-color: #E3F2FD !important;

            //color: black;

        }
    }


}

.btn-nav {
    &:hover {
        color: black !important;
    }
    display: block;
}
</style>