const Layout = () => import("@/layout/index.vue");

export default {
  path: "/park",
  name: "Park",
  component: Layout,
  redirect: "/park/index",
  meta: {
    icon: "ParkIcon",
    title: "厂房管理",
    rank: 0
  },
  children: [
    {
      path: "/park",
      name: "Park",
      component: () => import("@/views/park/index.vue"),
      meta: {
        title: "厂房列表"
      }
    },
    {
      path: "/parkpreview",
      name: "Park1",
      component: () => import("@/views/park/index.vue"),
      meta: {
        title: "厂房预览"
      }
    }
  ]
} as RouteConfigsTable;
