import { createRouter, createWebHistory } from "vue-router";
import Homeview from "@/views/HomeView.vue";

const routes = [{ path: "/", name: "home", component: Homeview }];

export default createRouter({
    history: createWebHistory(),
    routes,
});
