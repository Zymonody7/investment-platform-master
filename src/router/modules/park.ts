const Layout = () => import("@/layout/index.vue");

export default {
  path: "/park",
  name: "Park",
  component: Layout,
  redirect: "/park/index",
  meta: {
    icon: "ParkIcon",
    title: "园区管理",
    rank: 0
  },
  children: [
    {
      path: "/park",
      name: "Park",
      component: () => import("@/views/park/index.vue"),
      meta: {
        title: "园区管理"
      }
    }
  ]
} as RouteConfigsTable;
