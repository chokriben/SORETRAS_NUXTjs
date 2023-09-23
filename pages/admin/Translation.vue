<script>
export default {
  props: {
    language: {
      type: String,
      default: 'en' // Langue par défaut
    }
  },
  computed: {
    translation() {
      // Obtenir la traduction en fonction de la langue sélectionnée
      if (this.language === 'fr') {
        return {
          greeting: 'Bonjour',
          message: 'Bienvenue dans notre application'
        
        };
      } else if (this.language === 'ar') {
        return {
          greeting: 'مرحبًا',
          message: 'مرحبًا بك في تطبيقنا',
          message:'فشل في التسجيل!'
        };
      } else {
        // Langue par défaut (anglais)
        return {
          greeting: 'Hello',
          message: 'Welcome to our application',
          message: 'Registration failed!',
        };
      }
    }
  }
};
</script>
<template>
   <div>
    <slot :translation="translation"></slot>
  </div>
  <v-card>
    <v-tabs v-model="tab" bg-color="deep-purple-accent-4" centered stacked>
      <v-tab value="tab-1">
        <v-icon>mdi-translate</v-icon>
        traduction français
      </v-tab>

      <v-tab value="tab-2">
        <v-icon>mdi-translate</v-icon>
        traduction anglais
      </v-tab>

      <v-tab value="tab-3">
        <v-icon>mdi-translate</v-icon>
        traduction arabe
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item v-for="i in 3" :key="i" :value="'tab-' + i">
        <v-card>
          <v-card-text>
            <slot></slot>   
          
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>
