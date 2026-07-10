import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("@/layout/index.vue"),
            redirect: "timeline",
            children: [
                {
                    path: "timeline",
                    component: () => import("@/views/timeline/index.vue"),
                },
                {
                    path: "player-tag",
                    component: () => import("@/views/playerTag/index.vue"),
                },
                {
                    path: "player-profile",
                    component: () => import("@/views/playerProfile/index.vue"),
                },
                {
                    path: "backpack",
                    component: () => import("@/views/backpack/index.vue"),
                },
                {
                    path: "texas",
                    component: () => import("@/views/texas/index.vue"),
                },
                {
                    path: "short-deck",
                    component: () => import("@/views/shortDeck/index.vue"),
                },
                {
                    path: "all-in-or-fold",
                    component: () => import("@/views/allInOrFold/index.vue"),
                },
                {
                    path: "omaha",
                    component: () => import("@/views/omaha/index.vue"),
                },
                {
                    path: "squid",
                    component: () => import("@/views/squid/index.vue"),
                },
                {
                    path: "thunder",
                    component: () => import("@/views/thunder/index.vue"),
                },
                {
                    path: "ofc",
                    component: () => import("@/views/ofc/index.vue"),
                },
                {
                    path: "thirteen",
                    component: () => import("@/views/thirteen/index.vue"),
                },
                {
                    path: "tournament",
                    component: () => import("@/views/tournament/index.vue"),
                },
                {
                    path: "earnings",
                    component: () => import("@/views/earnings/index.vue"),
                },
            ],
        },
    ],
});

export default router;
