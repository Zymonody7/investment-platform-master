const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/WelcomeFull",
    name: "WelcomeFull",
    component: () => import("@/views/welcome/index.vue"),
    meta: {
      title: "大屏首页",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/index.vue"),
    meta: {
      title: "注册",
      showLink: false,
      rank: 102
    }
  },
  {
    path: "/updateUserInfo",
    name: "UpdateUserInfo",
    component: () => import("@/views/userInfo/updateUserInfo/index.vue"),
    meta: {
      title: "修改密码",
      showLink: false,
      rank: 103
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      icon: "homeFilled",
      title: "首页",
      showLink: false,
      rank: 104
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
