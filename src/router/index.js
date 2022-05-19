import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import NotFound from "../views/NotFound.vue";
import Web3AuthAuthentication from "@/components/Web3AuthAuthentication";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/web3-auth",
    name: "Web3AuthAuthentication",
    component: Web3AuthAuthentication
  },
  {
    path: "/:catchAll(.*)",
    name: "PageNotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;