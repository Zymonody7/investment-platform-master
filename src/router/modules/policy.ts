const Layout = () => import("@/layout/index.vue");

export default {
  path: "/policy",
  name: "Policy",
  component: Layout,
  redirect: "/policy",
  meta: {
    icon: "ep:document",
    title: "企业政策",
    rank: 0
  },
  children: [
    {
      path: "/policy",
      name: "Policy",
      component: () => import("@/views/policy/index.vue"),
      meta: {
        title: "企业政策"
      }
    }
  ]
} as RouteConfigsTable;
