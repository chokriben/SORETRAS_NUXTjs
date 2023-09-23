// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({


  plugins: [
    { src: '~/plugins/globalVariable.js', mode: 'client' }
  ],
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify']
  },
  auth: {
    provider: {
      type: 'local',
      addDefaultCallbackUrl: false,
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n',],

  i18n: {
    /* module options */
    lazy: false,
    langDir: "locales",
    strategy: "prefix_except_default",
    locales: [
      {
        src: "/images/flag/france.png",
        code: "fr",
        iso: "fr-FR",
        name: "Français",
        file: "fr.json"
      },
      {
        src: "/images/flag/uk.png",
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json"
      },
      {
        src: "/images/flag/tunisie.png",
        code: "ar",
        iso: "ar-TN",
        name: "العربية",
        file: "ar.json"
      }
    ],
    defaultLocale: "fr",
    fallbackLocale: "fr",
  },


  pinia: {
    autoImports: [
      ['defineStore', 'definePiniaStore'],
    ],

  },
  app: {
    head: {
      title: 'SRTK',
      meta: [
        { name: 'description', content: 'SRTK' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css' }
      ],
      script: [
        { src: 'https://www.google.com/recaptcha/enterprise.js?render=6Lcdq_4nAAAAAOTvxv2Omoot_sAlRMyrQPlaPmnz' } // Replace YOUR_SITE_KEY with your actual site key
      ],
    }

  },

  components: [
    { path: '~/components/front/modal', extensions: ['vue'] },
    { path: '~/components/front/loader', extensions: ['vue'] },
    { path: '~/components/front/skeleton', extensions: ['vue'] },
    { path: '~/components/front/forms', extensions: ['vue'] },
    { path: '~/components/front/menu', extensions: ['vue'] },
    { path: '~/components/front/tab', extensions: ['vue'] },
    { path: '~/components/front/expansion', extensions: ['vue'] },
    { path: '~/components/front/card', extensions: ['vue'] },
    { path: '~/components/front/nav-bread-crumbs', extensions: ['vue'] },
    { path: '~/components/front/about-us', extensions: ['vue'] },
    { path: '~/components/front/timeline', extensions: ['vue'] },
    { path: '~/components/front/widget', extensions: ['vue'] },
    { path: '~/components/back/dashboard', extensions: ['vue'] },
    { path: '~/components/back/table', extensions: ['vue'] },
    { path: '~/components/back/user', extensions: ['vue'] },
    { path: '~/components/back/commun', extensions: ['vue'] },

  ],


})
