const Layout = () => import("@/layout/index.vue");

export default {
  path: "/park",
  name: "Park",
  component: Layout,
  redirect: "/park",
  meta: {
    icon: "homeFilled",
    title: "park",
    rank: 0
  },
  children: [
    {
      path: "/park",
      name: "Park",
      component: () => import("@/views/park/index.vue"),
      meta: {
        title: "park"
      }
    }
  ]
} as RouteConfigsTable;
