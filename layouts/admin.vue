<template>
  <v-app id="inspire">
    <div v-if="!token" style="position: fixed; z-index:9999 ; width:100%; height:100%; background-color:white">

    </div>
    <!-- <Loader v-if="isLoading" :overlayP="isLoading" /> -->
    <v-app-bar color="info" density="compact">
      <v-row>
        <v-col cols="2" sm="2" class="ml-5">
          <v-text-field clearable density="compact" variant="underlined" label="Chercher..."
            append-inner-icon="mdi-magnify" single-line hide-details max-width="100px"></v-text-field>
        </v-col>
      </v-row>
      <template v-slot:append>

        <VBtn icon variant="text" color="default" class="me-2" size="small">
          <VIcon icon="mdi-bell-outline" size="24" />
        </VBtn>

        <VBadge v-bind="avatarBadgeProps">
          <VAvatar style="cursor: pointer;" color="primary" variant="tonal">

            <img src="@/assets/images/avatars/avatar-1.png" alt="Avatar" />

            <!-- SECTION Menu -->
            <VMenu activator="parent" width="230" location="bottom end" offset="14px">
              <VList>
                <!-- 👉 User Avatar & Name -->
                <VListItem>
                  <template #prepend>
                    <VListItemAction start>
                      <VBadge v-bind="avatarBadgeProps">
                        <VAvatar color="primary" size="40" variant="tonal">

                          <img src="@/assets/images/avatars/avatar-1.png" alt="Avatar" />

                        </VAvatar>
                      </VBadge>
                    </VListItemAction>
                  </template>

                  <VListItemTitle class="font-weight-semibold">
                    Firas Gha
                  </VListItemTitle>
                  <VListItemSubtitle class="text-disabled">
                    Admin
                  </VListItemSubtitle>
                </VListItem>

                <VDivider class="my-2" />

                <!-- 👉 Profile -->
                <VListItem link>
                  <template #prepend>
                    <VIcon class="me-2" icon="mdi-account-outline" size="22" />
                  </template>

                  <VListItemTitle>Profile</VListItemTitle>
                </VListItem>

                <!-- 👉 Settings -->


                <v-list-item link to="/admin/settings">
                  <template v-slot:prepend>
                    <v-icon class="me-2" icon="mdi-cog-outline" size="22" />
                  </template>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>


                <!-- Divider -->
                <VDivider class="my-2" />

                <!-- 👉 Logout -->
                <VListItem @click="logout">
                  <template #prepend>
                    <VIcon class="me-2" icon="mdi-logout-variant" size="22" />
                  </template>

                  <VListItemTitle>Logout</VListItemTitle>

                </VListItem>
                <!-- 👉 Register -->


              </VList>
            </VMenu>
            <!-- !SECTION -->
          </VAvatar>
        </VBadge>

      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-sheet color="grey-lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey-darken-1" size="64">
          <img src="@/assets/images/avatars/avatar-1.png" alt="Avatar" />

        </v-avatar>

        <div style="color: rgb(98, 0, 128);  word-wrap: break-word;">{{ email }}</div>
      </v-sheet>
      <v-divider></v-divider>


      <v-list v-model:opened="open" v-if="gare_id == 'null'">
        <NuxtLink to="/admin/dashboard"><v-list-item prepend-icon="mdi-home" title="Home" link></v-list-item>
        </NuxtLink>
        <NuxtLink to="/admin/Setting"><v-list-item prepend-icon="mdi-cog" title="Setting" link></v-list-item>
        </NuxtLink>
        <NuxtLink to="/admin/importation"><v-list-item prepend-icon="mdi-import" title="Importation" link></v-list-item>
        </NuxtLink>
        <!-- chokri -->
        <v-list-group value="Users">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Users"></v-list-item>
          </template>
          <NuxtLink to="/admin/adminAdd"><v-list-item prepend-icon="mdi-plus" title="Ajouter Admin" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/admin"><v-list-item prepend-icon="mdi-account-outline" title="Liste des Admins"
              link></v-list-item></NuxtLink>
          <NuxtLink to="/admin/adminemp"><v-list-item prepend-icon="mdi-account-outline" title="Liste des Emp"
              link></v-list-item></NuxtLink>
        </v-list-group>


        <v-list-group value="Horaires">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-calendar" title="Horaires"></v-list-item>
          </template>
          <NuxtLink to="/admin/Horaire"><v-list-item prepend-icon="mdi-clock" title="Ajouter Horaire" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/Horaires"><v-list-item prepend-icon="mdi-clock" title="Horaires" link></v-list-item>
          </NuxtLink>
        </v-list-group>





        <v-list-group value="Evenements">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Evenements"></v-list-item>
          </template>
          <NuxtLink to="/admin/evenementAdd"><v-list-item prepend-icon="mdi-calendar" title="Ajouter evenement"
              link></v-list-item></NuxtLink>
          <NuxtLink to="/admin/Evenement"><v-list-item prepend-icon="mdi-calendar" title="Evenement" link></v-list-item>
          </NuxtLink>
        </v-list-group>




        <v-list-group value="Etablissements">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-school" title="Etablissements"></v-list-item>
          </template>

          <NuxtLink to="/admin/etablissements"><v-list-item prepend-icon="mdi-school" title="Etablissements"
              link></v-list-item></NuxtLink>
          <NuxtLink to="/admin/etablissementss"><v-list-item prepend-icon="mdi-school" title="etablissementss"
              link></v-list-item></NuxtLink>


        </v-list-group>
        <!-- chokri -->
        <NuxtLink to="/admin/Codebarre"><v-list-item prepend-icon="mdi-barcode-scan" title="Code Barre Inter"
            link></v-list-item>
        </NuxtLink>

        <NuxtLink to="/admin/Code"><v-list-item prepend-icon="mdi-barcode-scan" title="liste Code Barre Inter"
            link></v-list-item>
        </NuxtLink>
        <!-- chokri -->
        <v-list-group value="Abonnements">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-card-account-details-outline" title="Abonnements"></v-list-item>

          </template>




          <NuxtLink to="/admin/abonnementR" class="custom-link" link>
            <v-list-item>

              <v-list-item-content>
                <v-list-item-title class="custom-title"> <v-list-item-icon>
                    <v-icon>mdi-card</v-icon>
                  </v-list-item-icon>abonnement scolaire</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </NuxtLink>


          <NuxtLink to="/admin/abonnementU" class="custom-link" link>
            <v-list-item>

              <v-list-item-content>
                <v-list-item-title class="custom-title"> <v-list-item-icon>
                    <v-icon>mdi-card</v-icon>
                  </v-list-item-icon>abonnement Ordinaire</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </NuxtLink>

          <NuxtLink to="/admin/abonnementI" class="custom-link" link>
            <v-list-item>

              <v-list-item-content>
                <v-list-item-title class="custom-title"> <v-list-item-icon>
                    <v-icon>mdi-printer</v-icon>
                  </v-list-item-icon>Abonnement Imprimer</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/abonnementimp" class="custom-link" link>
            <v-list-item>

              <v-list-item-content>
                <v-list-item-title class="custom-title"> <v-list-item-icon>
                    <v-icon>mdi-printer</v-icon>
                  </v-list-item-icon>sms</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </NuxtLink>
          <NuxtLink to="/admin/verifpaiement" class="custom-link" link>
            <v-list-item>

              <v-list-item-content>
                <v-list-item-title class="custom-title"> <v-list-item-icon>
                    <v-icon>mdi-printer</v-icon>
                  </v-list-item-icon>verifpaiement</v-list-item-title>
              </v-list-item-content>
            </v-list-item>


          </NuxtLink>
        </v-list-group>




        <!-- <NuxtLink to="/admin/DemandeAbonnement"><v-list-item prepend-icon="mdi-card-account-details-outline"
            title="DemandeAbonnement" link></v-list-item></NuxtLink>
-->



        <v-list-group value="Offres">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-comma-box" title="Offres"></v-list-item>
          </template>

          <NuxtLink to="/admin/appel-doffre"><v-list-item prepend-icon="mdi-file-document" title="+Appels d'offres"
              link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/list-appel-doffre"><v-list-item prepend-icon="mdi-file-document" title="Appels d'offres"
              link></v-list-item>
          </NuxtLink>



        </v-list-group>

        <v-list-group value="Statistiques">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-chart-bar" title="Statistiques"></v-list-item>
          </template>

          <v-list-group value="Régional">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-circle" title="Régional"></v-list-item>
            </template>

            <v-list-item prepend-icon="mdi-circle-outline" title="Ordinaire" link></v-list-item>
            <v-list-item prepend-icon="mdi-circle-outline" title="Scolaire" link></v-list-item>


          </v-list-group>

          <v-list-group value="Urbain">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-circle" title="Urbain"></v-list-item>
            </template>

            <v-list-item prepend-icon="mdi-circle-outline" title="Ordinaire" link></v-list-item>
            <v-list-item prepend-icon="mdi-circle-outline" title="Scolaire" link></v-list-item>


          </v-list-group>
        </v-list-group>


        <v-list-group value="Recrutements">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Recrutements"></v-list-item>
          </template>
          <NuxtLink to="/admin/recrutement"><v-list-item prepend-icon="mdi-plus" title="Recrutements" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/recrutements"><v-list-item prepend-icon="mdi-account" title="Recrutements"
              link></v-list-item>
          </NuxtLink>
        </v-list-group>



        <v-list-group value="Lignes">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Lignes"></v-list-item>
          </template>
          <NuxtLink to="/admin/ligne"><v-list-item prepend-icon="mdi-city" title="Ligne" link></v-list-item></NuxtLink>

          <NuxtLink to="/admin/lignes"><v-list-item prepend-icon="mdi-city" title="liste Ligne" link></v-list-item>
          </NuxtLink>

        </v-list-group>


        <v-list-group value="Pages">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Pages"></v-list-item>
          </template>

          <NuxtLink to="/admin/presentation"><v-list-item prepend-icon="mdi-presentation" title="presentation"
              link></v-list-item> </NuxtLink>
          <NuxtLink to="/admin/presentations"><v-list-item prepend-icon="mdi-presentation" title="liste pages"
              link></v-list-item> </NuxtLink>

        </v-list-group>

        <v-list-group value="Medias">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Medias"></v-list-item>
          </template>
          <NuxtLink to="/admin/media"><v-list-item prepend-icon="mdi-file-image" title="Media" link></v-list-item>
          </NuxtLink>

          <NuxtLink to="/admin/medias"><v-list-item prepend-icon="mdi-file-image" title="liste Media" link></v-list-item>
          </NuxtLink>

        </v-list-group>
        <v-list-group value="Actualites">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Actualités"></v-list-item>
          </template>
          <NuxtLink to="/admin/actualite"><v-list-item prepend-icon="mdi-newspaper" title="+ Actualités"
              link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/list-actualite"><v-list-item prepend-icon="mdi-newspaper" title="liste Actualités"
              link></v-list-item>
          </NuxtLink>
        </v-list-group>
        <v-list-group value="Stations">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-train" title="Stations"></v-list-item>
          </template>
          <NuxtLink to="/admin/Station"><v-list-item prepend-icon="mdi-train" title="+ Station" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/list-Station"><v-list-item prepend-icon="mdi-train" title="liste Stations"
              link></v-list-item>
          </NuxtLink>
        </v-list-group>
        <v-list-group value="Gares">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-train" title="Gares"></v-list-item>
          </template>
          <NuxtLink to="/admin/gare"><v-list-item prepend-icon="mdi-train-variant" title="Gare" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/list-gare"><v-list-item prepend-icon="mdi-train" title="liste Gares" link></v-list-item>
          </NuxtLink>
        </v-list-group>
        <v-list-group value="Siége">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-home-map-marker" title="Siége"></v-list-item>
          </template>
          <NuxtLink to="/admin/tarif"><v-list-item prepend-icon="mdi-currency-usd" title="Tarif" link></v-list-item>
          </NuxtLink>


          <NuxtLink to="/admin/ville"><v-list-item prepend-icon="mdi-subway-variant" title="ville" link></v-list-item>
          </NuxtLink>

          <NuxtLink to="/admin/reservation"><v-list-item prepend-icon="mdi-calendar-check" title="Reservation"
              link></v-list-item></NuxtLink>
        </v-list-group>
        <NuxtLink to="/admin/slider"><v-list-item prepend-icon="mdi-slide" title="slider" link></v-list-item></NuxtLink>
        <NuxtLink to="/admin/newslettre"><v-list-item prepend-icon="mdi-email" title="Newslettres" link></v-list-item>
        </NuxtLink>
        <v-list-group value="Autres">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-home-map-marker" title="Autres"></v-list-item>
          </template>

          <!-- <NuxtLink to="/admin/categorie"><v-list-item prepend-icon="mdi-folder" title="categorie" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/categories"><v-list-item prepend-icon="mdi-folder" title="categories" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/gouvernorat"><v-list-item prepend-icon="mdi-map-marker" title="gouvernorat"
              link></v-list-item></NuxtLink>
          <NuxtLink to="/admin/qualite"><v-list-item prepend-icon="mdi-check" title="qualite" link></v-list-item>
          </NuxtLink>
          <NuxtLink to="/admin/secruite"><v-list-item prepend-icon="mdi-lock" title="secruite" link></v-list-item>
          </NuxtLink>-->
        </v-list-group>


        <!--eve -->
        <v-list-item prepend-icon="mdi-newspaper-variant" title="Activités" link></v-list-item>

        <!--<NuxtLink to="/admin/visiteur"><v-list-item prepend-icon="mdi-account" title="Visiteur" link></v-list-item>
        </NuxtLink>-->

      </v-list>
      <v-list v-model:opened="open" v-if="gare_id != 'null'">
        <NuxtLink to="/admin/dashboard"><v-list-item prepend-icon="mdi-home" title="Home" link></v-list-item>
        </NuxtLink>

        <!-- chokri -->














        <v-list-group value="Abonnements">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-card-account-details-outline" title="Abonnements"></v-list-item>

          </template>




          <NuxtLink to="/admin/abonnementR" class="custom-link" link>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-card</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="custom-title">abonnement scolaire</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </NuxtLink>


          <NuxtLink to="/admin/abonnementU" class="custom-link" link>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-card</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="custom-title">abonnement Ordinaire</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </NuxtLink>

          <NuxtLink to="/admin/abonnementI" class="custom-link" link>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-printer</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="custom-title">Abonnement Imprimer</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </NuxtLink>

        </v-list-group>




        <!-- <NuxtLink to="/admin/DemandeAbonnement"><v-list-item prepend-icon="mdi-card-account-details-outline"
            title="DemandeAbonnement" link></v-list-item></NuxtLink>
-->





        <v-list-group value="Statistiques">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-chart-bar" title="Statistiques"></v-list-item>
          </template>

          <v-list-group value="Régional">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-circle" title="Régional"></v-list-item>
            </template>

            <v-list-item prepend-icon="mdi-circle-outline" title="Ordinaire" link></v-list-item>
            <v-list-item prepend-icon="mdi-circle-outline" title="Scolaire" link></v-list-item>


          </v-list-group>

          <v-list-group value="Urbain">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-circle" title="Urbain"></v-list-item>
            </template>

            <v-list-item prepend-icon="mdi-circle-outline" title="Ordinaire" link></v-list-item>
            <v-list-item prepend-icon="mdi-circle-outline" title="Scolaire" link></v-list-item>


          </v-list-group>
        </v-list-group>




        <!--<NuxtLink to="/admin/visiteur"><v-list-item prepend-icon="mdi-account" title="Visiteur" link></v-list-item>
        </NuxtLink>-->

      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-8 px-6" fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import { ref } from 'vue';

import { useAdminStore } from '@/store/auth';
import avatar1 from '@/assets/images/avatars/avatar-1.png';
let ga = 0;
const token =
  typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;


export default {
  mounted() {

    ga = window.localStorage.getItem('gare_id');
    //console.log("sss", ga);
    if (ga === 'null') {
      ga = '0';
      ////console.log("hello",g);
    }
    // //console.log("sss", typeof (ga));
    //console.log("sss", ga);
    if (!token) {

      // Redirect to the login page or perform any desired action
      window.location.href = '/';
    }

  },
  setup() {
    const axios = useNuxtApp().$axios;
    const token = useCookie('token', {
      watch: true,
      httpOnly: true
    });
    const avatarBadgeProps = {
      dot: true,
      location: 'bottom right',
      offsetX: 3,
      offsetY: 3,
      color: 'success',
      bordered: true,
    };

    const isLoading = ref(false);
    const drawer = ref(null);
    const open = ref(['Users']);

    const logout = () => {
      const confirmed = confirm("Are you sure you want to log out?");
      if (confirmed) {
        isLoading.value = true;
        axios
          .post(
            '/admin/logout',
            { body: "" },
            { headers: { "Authorization": `Bearer ${token.value}` } }
          )
          .then(res => {
            localStorage.removeItem("token");
            localStorage.removeItem('email');
            navigateTo('/');
          })
          .catch(error => {
            console.error(error);
            isLoading.value = false;
          });
      }
    };


    const adminStore = useAdminStore();
    let email = adminStore.email;
    let gare_id = adminStore.gare_id;
    retrieveEmailFromLocalStorage(); // Retrieve 'email' from local storage

    if (!email) {
      // Redirect or handle the case when 'email' is empty
    } else {
      saveEmailToLocalStorage(); // Save 'email' to local storage
      asyncFunction();
    }

    function saveEmailToLocalStorage() {
      if (process.client) {
        window.localStorage.setItem('email', email);
      }
    }

    function retrieveEmailFromLocalStorage() {
      if (process.client) {
        email = window.localStorage.getItem('email') || '';
        gare_id = window.localStorage.getItem('gare_id') || '';
        //console.log('cl', gare_id);
      }
    }

    async function asyncFunction() {
      // Your asynchronous logic goes here
    }

    return {
      email,
      gare_id,
      isLoading,
      drawer,
      open,
      logout,
      avatarBadgeProps,
      token,
      ga,

    };
  }
};

</script>


<style lang="scss" scoped>
.v-list-group__items .v-list-item {
  padding-inline-start: 20px !important
}

.custom-link {
  text-decoration: none;
}

.custom-title {
  margin-left: 10px;
}
</style>