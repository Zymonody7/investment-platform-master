<script setup lang="ts">
import { useWelcomeStoreHook } from "@/store/modules/welcome";
import router from "@/router";
defineOptions({
  name: "Welcome"
});

const welcomeStore = useWelcomeStoreHook();
const HomeUrl = welcomeStore.welcomeURL;
const full = router.currentRoute.value.name == "WelcomeFull";
const className = full ? "fullHomeBox" : "homeBox";
function toHome() {
  router.push("/");
}
</script>

<template>
  <div :class="className">
    <iframe :src="HomeUrl" style="height: 100%; width: 100%" />
  </div>
  <div class="backButton">
    <el-button type="primary" @click="toHome" v-if="full">返回首页</el-button>
  </div>
</template>

<style scoped>
.homeBox {
  height: 85vh;
  box-sizing: border-box;
}

.fullHomeBox {
  height: 100vh;
  width: 100vw;
}

.backButton {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
