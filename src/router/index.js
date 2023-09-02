// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "DefaultView",
    component: () => import("@/layouts/default/DefaultView.vue"),
    children: [
      {
        path: "MgtProvinces",
        name: "MgtProvinces",
        component: () => import("@/admin/Provinces/MgtProvinces.vue"),
      },
      {
        path: "MgtDistricts",
        name: "MgtDistricts",
        component: () => import("@/admin/Provinces/MgtDistricts.vue"),
      },
      // Other child routes go here
    ],
    
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
