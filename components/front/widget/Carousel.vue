<template>
    <v-sheet class="mb-4 mt-5" elevation="3" max-width="850">
        <div>
            <h2 class="p-2 g-title">Galerie photo</h2>
        </div>


        <v-slide-group v-model="model" class="pa-4" selected-class="bg-primary" show-arrows>
            <v-slide-group-item v-for="(item, index) in items" :key="index" v-slot="{ isSelected, toggle, selectedClass }">
                <v-slide-group-item v-slot="{ isSelected, toggle, selectedClass }">
                    <v-img class="ma-4 yes-crl" cover  height="100" width="100" :aspect-ratio="16 / 9"
                        :src="item.src" @click="openPopup(item)"></v-img>
                </v-slide-group-item>
            </v-slide-group-item>
          


        </v-slide-group>
<v-dialog v-model="popupVisible" max-width="700px">
      <v-carousel v-if="popupVisible" cycle hide-delimiters>
        <v-carousel-item v-for="(item, index) in items" :key="index">
          <v-sheet >
            <v-img :src="item.src"></v-img>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <v-btn icon @click="closePopup" class="close-button">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-dialog>
        <!-- <v-expand-transition>
            <v-sheet v-if="model != null" height="200">
                <div class="d-flex fill-height align-center justify-center">
                    <h3 class="text-h6">
                        Show {{ model }}
                    </h3>
                </div>
            </v-sheet>
        </v-expand-transition> -->
    </v-sheet>
</template>
<script>
export default {
    data: () => ({
        model: {},
        items: [
        { src: '/images/cam/21.jpg' },
        { src: '/images/cam/16.jpg' },
        { src: '/images/cam/17.jpg' },
        { src: '/images/cam/18.jpg' },
        { src: '/images/cam/19.jpg' },
        { src: '/images/cam/15.jpg' },
        
        // Ajoutez ici d'autres images avec leurs chemins respectifs
      ],
      popupVisible: false,
      popupImage: null
    }),
    methods: {
    openPopup(image) {
      this.popupImage = image;
      this.popupVisible = true;
    },
     closePopup() {
      this.popupVisible = false;
    }
}
}
</script>
<style>
.yes-crl{
    cursor:pointer;
}
.g-title {
    font-size: 20px;
    font-weight: 600;
}
.close-button {
  position: absolute;
  top: -30px;
  right: -30px;
  
}
</style>