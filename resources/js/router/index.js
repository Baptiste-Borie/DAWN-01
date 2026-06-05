import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import YtdlView from "@/views/YtdlView.vue";

const routes = [
    { path: "/", name: "home", component: HomeView },
    { path: "/ytdl", name: "ytdl", component: YtdlView },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
