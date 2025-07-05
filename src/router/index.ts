import { createRouter, createWebHistory } from "vue-router";
import Home from "../App.vue";

const routes = [{ name: "chat", path: "/chat/:id", component: Home }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
