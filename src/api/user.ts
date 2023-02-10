import { http } from "@/utils/http";
import { baseUrlApi } from "@/api/utils";
export type UserResult = {
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const login = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};

/** zs用户接口返回值 */
export type zsUserResult = {
  msg: string;
  code: number;
};

/** zs登录接口 */
export const zsLogin = (data?: object) => {
  return http.request<zsUserResult>("post", baseUrlApi("/admin/user/login"), {
    data
  });
};

/** zs登录接口 */
export const zsRegister = (data?: object) => {
  return http.request<zsUserResult>("post", baseUrlApi("/admin/user/save"), {
    data
  });
};
