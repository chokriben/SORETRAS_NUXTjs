<template>
  <div class="top-header">
    <div class="block1">
      <v-icon class="m-2 social-icon fb" color="black" size="x-large" icon="mdi-facebook"></v-icon>
      <v-icon class="m-2 social-icon yt" color="black" size="x-large" icon="mdi-youtube"></v-icon>
      <v-icon class="m-2 social-icon tw" color="black" size="x-large" icon="mdi-twitter"></v-icon>
    </div>
    <div class="block2 d-flex">
      <v-btn :rounded="0" variant="text" class="d-none d-md-flex">
        <NuxtLink to="/parent/login">{{ $t('menu.parent_space') }}</NuxtLink>
      </v-btn>
      <v-btn :rounded="0" variant="text" class="d-none d-md-flex">
        <NuxtLink to="/">{{ $t('menu.plan') }}</NuxtLink>
      </v-btn>
      <v-btn :rounded="0" variant="text" class="d-none d-md-flex">
        <NuxtLink to="/">{{ $t('menu.utile_link') }}</NuxtLink>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn :rounded="0" append-icon="mdi-chevron-down" variant="text" v-bind="props">
            <img :src="getFlagSrc(language)" width="20" alt="" style="display: inline-block; margin-right: 5px;">
            {{ getLanguageName(language) }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in locales" :key="item.code" @click="changeLocale(item.code)">
            <v-list-item-title>
              <img :src="item.src" width="20" alt="" style="display: inline-block; margin-right: 5px;">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {

  setup() {
    const { locales, locale, setLocale } = useI18n();
    const lang = [
      { src: "/images/flag/france.png", title: "Français", lab: "fr" },
      { src: "/images/flag/tunisie.png", title: "العربية", lab: "ar" },
      { src: "/images/flag/uk.png", title: "English", lab: "en" },
    ];
    const language = computed({
      get: () => locale.value,
      set: (value) => {

        setLocale(value);


        updateUrl(value);

      },
    });

    const router = useRouter();

    const changeLocale = (code) => {
      language.value = code;
      localStorage.setItem('locale', code);
      if (code == 'ar') {
        item.direction === 'rtl'
      } else {
        item.direction === 'ltr'
      }
    };

    const updateUrl = (code) => {
      const currentPath = router.currentRoute.value.path;

      let newPath = `/${code}${currentPath}`;

      newPath = newPath.replace(`/${locale.value}`, ``);
      newPath = newPath.replace(`/fr`, ``);

      //router.push(newPath);
      //window.location.href = newPath;

    };


    const getFlagSrc = (langCode) => {
      const langItem = lang.find((item) => item.lab === langCode);
      return langItem ? langItem.src : '';
    };

    const getLanguageName = (langCode) => {
      const langItem = lang.find((item) => item.lab === langCode);
      return langItem ? langItem.title : '';
    };



    return {
      locales,
      language,
      changeLocale,
      getFlagSrc,
      getLanguageName,
    };
  },
};
</script>

<style lang="scss" scoped>
.block1 a,
.block2 a {
  margin-right: 10px;
  color: #333;
  text-decoration: none;
}

.block2 a:last-child {
  margin-right: 0;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 0;
  height: 30px;
}

.social-icon {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-size: 22px;
}

.social-icon.fb:hover {
  color: #385898 !important;
}

.social-icon.yt:hover {
  color: #cc0000 !important;
}

.social-icon.tw:hover {
  color: #1d9bf0 !important;
}
</style>
