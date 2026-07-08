import "element-plus/es/components/message/style/css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";

async function bootstrap() {
    if (import.meta.env.VITE_USE_MSW === "true") {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
            onUnhandledRequest: "bypass",
        });
    }

    const app = createApp(App);
    app.use(router);
    app.mount("#app");
}

bootstrap();
