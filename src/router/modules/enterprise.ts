const Layout = () => import("@/layout/index.vue");

export default {
  path: "/enterprise",
  name: "Enterprise",
  component: Layout,
  redirect: "/enterprise",
  meta: {
    icon: "tabler:brand-office",
    title: "企业管理",
    rank: 0
  },
  children: [
    {
      path: "/enterprise",
      name: "Enterprise",
      component: () => import("@/views/enterprise/index2.vue"),
      meta: {
        title: "企业列表"
      }
    },
    {
      path: "/occupancy",
      name: "Occupancy",
      component: () => import("@/views/enterprise/occupancy.vue"),
      meta: {
        title: "入驻情况"
      }
    }
  ]
} as RouteConfigsTable;
