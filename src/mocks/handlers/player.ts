import { http, HttpResponse } from "msw";
import { mockPlayers } from "@/mock/players";
import type { PlayerListResponse } from "@/types/player";

export const playerHandlers = [
    http.get("/api/players/list", ({ request }) => {
        const url = new URL(request.url);
        const keyword =
            url.searchParams.get("keyword")?.trim().toLowerCase() || "";
        const pageParam = url.searchParams.get("page");
        const pageSizeParam = url.searchParams.get("pageSize");

        let list = [...mockPlayers];

        if (keyword) {
            list = list.filter(
                (item) =>
                    item.name.toLowerCase().startsWith(keyword) ||
                    item.country.toLowerCase().startsWith(keyword),
            );
        }

        const total = list.length;

        const shouldPaginate = pageParam !== null || pageSizeParam !== null;
        if (shouldPaginate) {
            const page = Number(pageParam || 1);
            const pageSize = Number(pageSizeParam || 20);
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            list = list.slice(start, end);
        }

        const data: PlayerListResponse = {
            list,
            total,
        };

        return HttpResponse.json(data);
    }),
];
