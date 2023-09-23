import { createVuetify , ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomTheme = {
  dark: false,
    colors: {
    orange: '#004e89',
    rose: '#E3F2FD',
    beige: '#efefd0ff',
    'gris-claire': '#efefd0',
    background: '#fff',
    surface: '#FFFFFF',
    primary: '#004e89',
    secondary: '#0383ff',
    logo: '#3737FF',
    footer: '#f8f9fa',
    copyright:'#0383ff',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}
export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        theme: {
        defaultTheme: 'myCustomTheme',
        themes: {
        myCustomTheme,
        }
    }

    })
    app.vueApp.use(vuetify);
})

