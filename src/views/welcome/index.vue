<script setup lang="ts">
import screenfull from "screenfull";
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
  screenfull.exit();
}
</script>

<template>
  <div style="margin: 0">
    <div :class="className">
      <iframe :src="HomeUrl" style="height: 100%; width: 100%" />
    </div>
    <div class="backButton">
      <el-button circle @click="toHome" v-if="full"
        ><el-icon><Back style="transform: scale(1.5)" /></el-icon
      ></el-button>
    </div>
  </div>
</template>

<style scoped>
.homeBox {
  height: 93vh;
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
