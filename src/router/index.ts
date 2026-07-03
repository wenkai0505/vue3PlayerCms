import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("@/layout/index.vue"),
            children: [
                {
                    path: "player-tag",
                    component: () => import("@/views/playerTag/index.vue"),
                },
            ],
        },
    ],
});

export default router;
