<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
</script>

<template>
  <div class="homeBox">
    <div class="illustration" />
    <div class="icon" />
    <h1 class="font">招商平台管理端</h1>
  </div>
</template>

<style scoped>
.homeBox {
  height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("@/assets/login/bg.png");
  background-size: cover;
}

.icon {
  height: 30vh;
  width: 30vh;
  background: url("@/assets/login/avatar.svg");
  background-size: cover;
}

.illustration {
  background: url("@/assets/login/illustration.svg");
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.font {
  font-size: 2rem;
}
</style>
