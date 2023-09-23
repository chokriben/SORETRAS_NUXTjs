<template>
  <div class="mt-7 text-center">
    <p class="font-bold">
      {{ error.statusCode }}
    </p>
    <p>
      {{ error.message }}
    </p>
    <button @click="handleError">Back To Home</button>
  </div>
</template>

<script setup>
defineProps(["error"]);
const handleError = () => {
  clearError({
    redirect: "/",
  });
};
</script>

<style lang="scss" scoped>
</style>