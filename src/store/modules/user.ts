import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { refreshTokenApi, zsLogin } from "@/api/user";
import { zsUserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { setToken, removeToken, UserNameKey, setUserName } from "@/utils/auth";

export let userName = "";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username: storageSession().getItem(UserNameKey) ?? ""
    // // 页面级别权限
    // roles: storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */ // 招商平台登录存储验证
    async loginByUsername(data) {
      return new Promise<zsUserResult>((resolve, reject) => {
        userName = data.username;
        zsLogin(data)
          .then(data => {
            if (data) {
              // 后端自动set-cookie设置Session 无需Token
              // setToken(data.data);
              // 在这里我们需要设置 user 的 username
              setUserName(userName);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      // 清除Cookie
      Cookies.set(UserNameKey, "");
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
