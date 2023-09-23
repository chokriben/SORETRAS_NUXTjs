<template>
    <v-app id="inspire">
        <div v-if="!token" style="position: fixed; z-index:9999 ; width:100%; height:100%; background-color:white">

        </div>
        <!-- <Loader v-if="isLoading" :overlayP="isLoading" /> -->
        <v-app-bar class="head_yes" density="compact">
            <v-row>
                <v-col cols="2" sm="2" class="ml-5">
                </v-col>
            </v-row>
            <template v-slot:append>

                <VBtn icon variant="text" color="white" class="me-2" size="small">
                    <VIcon icon="mdi-bell-outline" size="24" />
                </VBtn>

                <VBadge v-bind="avatarBadgeProps">
                    <VAvatar style="cursor: pointer;" color="primary" variant="tonal">
                        <VImg :src="avatar1" />

                        <!-- SECTION Menu -->
                        <VMenu activator="parent" width="230" location="bottom end" offset="14px">
                            <VList>
                                <!-- 👉 User Avatar & Name -->
                                <VListItem>
                                    <template #prepend>
                                        <VListItemAction start>
                                            <VBadge v-bind="avatarBadgeProps">
                                                <VAvatar color="primary" size="40" variant="tonal">
                                                    <VImg :src="avatar1" />
                                                </VAvatar>
                                            </VBadge>
                                        </VListItemAction>
                                    </template>

                                    <VListItemTitle class="font-weight-semibold">
                                        {{ cin }}
                                    </VListItemTitle>
                                    <VListItemSubtitle class="text-disabled">
                                        Parent
                                    </VListItemSubtitle>
                                </VListItem>

                                <VDivider class="my-2" />

                                <!-- 👉 Profile -->

                                <!-- 👉 Settings -->




                                <!-- 👉 Logout -->
                                <VListItem @click="logout">
                                    <template #prepend>
                                        <VIcon class="me-2" icon="mdi-logout-variant" size="22" />
                                    </template>

                                    <VListItemTitle>Se deconnecter</VListItemTitle>
                                </VListItem>
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
                    <VImg :src="avatar1" />
                </v-avatar>
                <div style="color: rgb(128, 51, 0)">Cin Parent:{{ cin }}</div>

            </v-sheet>

            <v-divider></v-divider>



            <v-list v-model:opened="open">
                <NuxtLink to="/parent/verif"><v-list-item prepend-icon="mdi-cog" title="Eléve inscrit" link></v-list-item>
                </NuxtLink>
                <v-list-group value="ab_urbain">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-home-map-marker" title="Urbain"></v-list-item>
                    </template>
                    <NuxtLink to="/parent/list_urbain"><v-list-item prepend-icon="mdi-list-box-outline"
                            title="Liste des demandes" link></v-list-item>
                    </NuxtLink>

                </v-list-group>
                <v-list-group value="ab_reg">
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" prepend-icon="mdi-home-map-marker" title="Regional"></v-list-item>
                    </template>
                    <NuxtLink to="/parent/list_reg"><v-list-item prepend-icon="mdi-list-box-outline"
                            title="Liste des demandes" link></v-list-item>
                    </NuxtLink>

                    <!--    <NuxtLink to="/parent/demande_regional"><v-list-item prepend-icon="mdi-message-question"
                            title="demande regional" link></v-list-item>
                    </NuxtLink>-->
                </v-list-group>
                <NuxtLink to="/parent/parametre"><v-list-item prepend-icon="mdi-cog" title="Parametre" link></v-list-item>
                </NuxtLink>

                <!-- chokri -->

            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container class="py-8 px-6" fluid>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>
<script setup>
import { useAdminStore } from '@/store/auth';
import avatar1 from '@/assets/images/avatars/avatar-1.png'
const axios = useNuxtApp().$axios
const token = useCookie('token', {
    watch: true,
    HttpOnly: true
})
let af = 0;
onMounted(() => {
    if (!token.value) {
        // Redirigez vers la page de connexion ou effectuez toute action souhaitée

        window.location.href = '/';
    }
});

const avatarBadgeProps = {
    dot: true,
    location: 'bottom right',
    offsetX: 3,
    offsetY: 3,
    color: 'success',
    bordered: true,
}
const isLoading = ref(false)
const drawer = ref(null)
const open = ref(['Users'])
const logout = () => {
    const confirmed = confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirmed) {
        isLoading.value = true;
        axios
            .post(
                '/admin/logout',
                { body: "" },
                { headers: { "Authorization": `Bearer ${token.value}` } }
            )
            .then(res => {
                localStorage.removeItem('token');
                localStorage.removeItem('cin');
                navigateTo('/parent/login');
            })
            .catch(error => {
                console.error(error);
                isLoading.value = false;
            });
    }
};


const adminStore = useAdminStore();
let cin = adminStore.cin;

retrieveCinFromLocalStorage(); // Retrieve 'cin' from local storage

if (!cin) {
    // Redirect or handle the case when 'cin' is empty
} else {
    saveCinToLocalStorage(); // Save 'cin' to local storage
    asyncFunction();
}

function saveCinToLocalStorage() {
    if (process.client) {
        window.localStorage.setItem('cin', cin);
    }
}

function retrieveCinFromLocalStorage() {
    if (process.client) {
        cin = window.localStorage.getItem('cin') || '';
    }
}

async function asyncFunction() {
    // Your asynchronous logic goes here
}
</script>



<style lang="scss" scoped>
.v-list-group__items .v-list-item {
    padding-inline-start: 20px !important
}

.head_yes {
    background: linear-gradient(to top, #0655a0, #0477e2) !important;

}
</style>