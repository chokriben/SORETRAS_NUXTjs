<script>
  export default {
    name: "VDatePicker",
    data() {
      return {
        picker: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substring(0, 10),
        picker2: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substring(0, 10),
      };
    },
  };
</script>

<template>
  <v-row justify="space-around">
    <v-date-picker
      v-model="picker"
      color="green lighten-1"
    ></v-date-picker>
    <v-date-picker
      v-model="picker2"
      color="green lighten-1"
      header-color="primary"
    ></v-date-picker>
  </v-row>
</template>