<template>
  <v-card :title="$t('widget.actualites')" subtitle="2023">

    <v-list>


      <v-list-item v-for="actualite in actualites" :key="actualite.id">
        <div class="act">
          <div class="div_actuality">
            <img src="/images/cam/1.jpg" alt="Avatar" class="actuality_img" />
          </div>
          <div class="des_actuality">
            <div class="date"> {{ actualite.date }}</div>
            <div class="description"><span class="name">{{ actualite.name }} </span> {{
              truncateText(actualite.description, 40) }}</div>
          </div>
        </div>
      </v-list-item>


    </v-list>
    <v-card-actions>
      <v-spacer></v-spacer>
      <router-link to="/actualite">
        <v-btn variant="outlined" color="#0383ff">{{ $t('menu.voir_plus') }}</v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      actualites: [],
      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    };
  },
  created() {
    this.fetchActualites();
  },
  methods: {
    truncateText(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
      }
      return text;
    },
    async fetchActualites() {
      try {
        const response = await axios.get('https://api.srtk.com.tn/api/actualite');
        const actualites = response.data.actualites;
        actualites.forEach(item => {
          const translation = item.translations.find(s => s.locale === this.$i18n.locale);
          if (translation) {
            item.name = translation.name;
            item.description = translation.description;
          }
        });

        this.actualites = actualites;
      } catch (error) {
        console.error(error);
        this.snackbar = {
          show: true,
          message: 'Échec du chargement des actualités!',
          color: 'error',
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-list-subheader__text {
  font-size: 20px !important;
}

.date {
  font-weight: bold;
}

.description {
  margin-bottom: 10px;
}

.name {
  color: #0383ff;
}

.actuality_img {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-left: 10px;
}

.div_actuality {
  display: inline-block;
}

.des_actuality {
  width: 180px;
  display: inline-block;
  margin-left: 10px;
}

.act {
  margin: 10px 10px;
}

.act:hover {}
</style>
