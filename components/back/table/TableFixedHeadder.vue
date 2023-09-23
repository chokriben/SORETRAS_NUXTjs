<script setup>
import { ref } from 'vue'
const axios = useNuxtApp().$axios
onMounted(() => {
    axios.get('actualites').then(res => {
        //console.log(res.data.actualites.data)
    })
})
const page = ref(1)
const dialog = ref(true)
const admins = [
    {
        nom: 'Admin1',
        email: 'Admin1@Admin1.com',
        role: 'Super Admin',

    },
    {
        nom: 'Admin2',
        email: 'Admin2@Admin2.com',
        role: 'Admin',

    },


]
</script>

<template>
    <v-card class="mb-2">
        <v-row class="p-4 justify-end">
            <v-col cols="3">
                <v-text-field clearable density="compact" variant="underlined" label="Chercher Admin"
                    append-inner-icon="mdi-magnify" single-line hide-details></v-text-field>


            </v-col>
            <v-col cols="2">
                <v-btn size="large" color="secondary" @click="dialog = !dialog">
                    Ajouter Admin
                </v-btn>
            </v-col>
        </v-row>



    </v-card>
    <VTable height="480" fixed-header>
        <thead>
            <tr>
                <th class="text-uppercase">
                    Nom
                </th>
                <th class="text-center text-uppercase">
                    Email
                </th>
                <th class="text-center text-uppercase">
                    Role
                </th>
                <th class="text-center text-uppercase">
                    Actions
                </th>

            </tr>
        </thead>
        <tbody>
            <tr v-for="item in admins" :key="item.nom">
                <td>{{ item.nom }}</td>
                <td class="text-center">
                    {{ item.email }}
                </td>
                <td class="text-center">
                    {{ item.role }}
                </td>
                <td class="text-center">
                    <v-btn variant="text" icon="mdi-dots-horizontal"></v-btn>

                </td>

            </tr>
        </tbody>
        <tfoot>

        </tfoot>

    </VTable>
    <div class="text-center">
        <v-pagination v-model="page" :length="15" :total-visible="5"></v-pagination>
    </div>
</template>
