<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
        <v-img :aspect-ratio="16 / 9" cover src="/images/cam/8.jpg">
          <v-expand-transition>
            <div v-if="isHovering"
              class="d-flex transition-fast-in-fast-out bg-blue-grey-lighten-4 v-card--reveal text-h2"
              style="height: 100%;">
              Lorem ipsum
            </div>
          </v-expand-transition>
        </v-img>

        <v-card-text class="pt-6">
          <div class="font-weight-light text-grey text-h6 mb-2">
            Lorem ipsum dolor
          </div>

          <h3 class="text-h6 font-weight-light text-black mb-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </h3>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  setup() {


    return {}
  }
}
</script>

<style lang="scss" scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .9;
  position: absolute;
  width: 100%;
}
</style>