<template>
  <div>

    <form enctype="multipart/form-data" @submit.prevent="submitForm">
      <VSnackbar v-model="snackbar.show" :color="snackbar.color" position="top">
        {{ snackbar.message }}
      </VSnackbar>
      <input type="file" @change="onchange" />
      <button type="submit"
        style="background-color: #4CAF50; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer;">
        Téléchargée
      </button>
    </form>
    <img v-if="file" :src="fileURL" style="max-width: 100%; margin-top: 20px;" />
  </div>
</template>

<script>
import { ref } from "vue";
import axios from 'axios';
definePageMeta({
  layout: "admin",
});
export default {
  setup() {
    const snackbar = ref({
      show: false,
      message: "",
      color: "",
    });
    const file = ref(null);


    const onchange = (e) => {
      file.value = e.target.files[0];
    };

    const submitForm = () => {
      if (!file.value) {
        showSnackbar("Veuillez sélectionner un fichier.", "error");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        //console.log("Authorization token not found.");
        return;
      }
      function showSnackbar(message, color) {
        snackbar.value.show = true;
        snackbar.value.message = message;
        snackbar.value.color = color;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const formData = new FormData();
      formData.append('file', file.value);

      axios.post('https://api.srtk.com.tn/api/admin/media/add', formData, config)
        .then(function (res) {

          showSnackbar("Image téléchargée avec succès !!", "success");
          file.value = null;
        })
        .catch(function (err) {
          console.error(err);
        });
    };

    // Computed property to generate the file URL for display
    const fileURL = computed(() => {
      return file.value ? URL.createObjectURL(file.value) : '';
    });

    return {
      onchange,
      submitForm,
      snackbar,
      file,
      fileURL,
    };
  }
}
</script>
