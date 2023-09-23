import { createApp } from 'vue';
import App from './App.vue';
import authMixin from './authMixin';

function setVuetifyLocale() {
    this.$vuetify.locale.current = this.$i18n.locale;
    ////console.log("lang :", this.$i18n.locale);
}

const app = createApp(App);
app.mixin(authMixin);
app.mount('#app');
setVuetifyLocale();