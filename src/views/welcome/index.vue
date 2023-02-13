<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
const HomeUrl = import.meta.env.VITE_HOME_URL;
console.log(import.meta);
</script>

<template>
  <div class="homeBox">
    <iframe :src="HomeUrl" style="height: 100%; width: 100%" />
  </div>
</template>

<style scoped>
.homeBox {
  height: 80vh;
  box-sizing: border-box;
}
</style>
