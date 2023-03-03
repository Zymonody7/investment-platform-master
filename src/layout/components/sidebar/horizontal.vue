<script setup lang="ts">
import screenfull from "screenfull";
import Search from "../search/index.vue";
import { ref, watch, nextTick } from "vue";
import SidebarItem from "./sidebarItem.vue";
import { useNav } from "@/layout/hooks/useNav";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import FullScreen from "@iconify-icons/ri/fullscreen-fill";
import Password from "@iconify-icons/ri/lock-password-fill";
import router from "@/router";

const menuRef = ref();

const {
  route,
  title,
  routers,
  logout,
  backHome,
  onPanel,
  menuSelect,
  username,
  avatarsStyle,
  toUpdateUserInfo
} = useNav();

nextTick(() => {
  menuRef.value?.handleResize();
});

watch(
  () => route.path,
  () => {
    menuSelect(route.path, routers);
  }
);

function toFullScreen() {
  router.push("/WelcomeFull");
  if (screenfull.isEnabled) {
    screenfull.request();
  }
}
</script>

<template>
  <div
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
    class="horizontal-header"
  >
    <div class="horizontal-header-left" @click="backHome">
      <FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />
      <h4>{{ title }}</h4>
    </div>
    <el-menu
      router
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="route.path"
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <span
        class="set-icon navbar-bg-hover"
        title="打开项目配置"
        @click="toFullScreen"
      >
        <IconifyIconOffline :icon="FullScreen" />
      </span>

      <Search />

      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover">
          <img
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            :style="avatarsStyle"
          />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
            <el-dropdown-item @click="toUpdateUserInfo">
              <IconifyIconOffline :icon="Password" style="margin: 5px" />
              修改密码
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        class="set-icon navbar-bg-hover"
        title="打开项目配置"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
