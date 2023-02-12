import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { refreshTokenApi, zsLogin, zsGetUserInfo } from "@/api/user";
import { zsUserResult, RefreshTokenResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  removeToken,
  UserNameKey,
  setUserName,
  JSessionKey
} from "@/utils/auth";

export let userName = "";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    uid: null,
    // 用户名
    username: null,
    // 用户创建时间
    createTime: null,
    // 用户更新时间
    updateTime: null
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
              // 设置Session
              storageSession().setItem(JSessionKey, Cookies.get("JSESSIONID"));
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
      // this.roles = [];
      // 清除Cookie
      Cookies.remove(UserNameKey);
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 获取用户信息 */
    async getUserInfo() {
      return new Promise((resolve, reject) => {
        zsGetUserInfo()
          .then(data => {
            console.log(data);
            this.username = data.userInfo.username;
            this.uid = data.userInfo.uid;
            this.createTime = data.userInfo.createTime;
            this.updateTime = data.userInfo.updateTime;
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              // setToken(data.data);
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
