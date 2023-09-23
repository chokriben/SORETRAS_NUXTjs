
<script>
import 'vuetify/dist/vuetify.min.css'


export default {
  name:"Theme",
  data() {
    return {
      selectedTheme: '', // Cette variable stockera le thème sélectionné
      themes: ['Thème 1', 'Thème 2', 'Thème 3'] // Liste des thèmes disponibles
    }
  }
}
</script>
<template>
  <v-list>
    <v-list-item-group v-model="selectedTheme">
      <v-list-item v-for="(theme, index) in themes" :key="index">
        <template v-slot:default="{ active, toggle }">
          <v-list-item-action>
            <v-checkbox :input-value="active" @click="toggle"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ theme }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>
