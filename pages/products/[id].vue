<template>
  <Head>
    <Title>{{ product.title }}</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <div>title : {{ product.title }}</div>
  <div>price : {{ product.price }}</div>
  <div>description : {{ product.description }}</div>
</template>

<script setup>
const { id } = useRoute().params;
definePageMeta({
  layout: "products",
});

const uri = "https://fakestoreapi.com/products/" + id;
const { data: product } = await useFetch(uri, {
  key: id,
});
if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
    fatal: true,
  });
}
</script>

<style lang="scss" scoped>
</style>