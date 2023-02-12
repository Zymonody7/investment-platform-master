const Layout = () => import("@/layout/index.vue");

export default {
  path: "/enterprise",
  name: "Enterprise",
  component: Layout,
  redirect: "/enterprise",
  meta: {
    icon: "ep:office-building",
    title: "企业",
    rank: 0
  },
  children: [
    {
      path: "/enterprise",
      name: "Enterprise",
      component: () => import("@/views/enterprise/index.vue"),
      meta: {
        title: "企业"
      }
    }
  ]
} as RouteConfigsTable;
