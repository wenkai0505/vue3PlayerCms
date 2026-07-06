import { http, HttpResponse } from "msw";
import { mockPlayerTagList } from "@/mock/playerTag";
import { mockPlayerTagNames } from "@/mock/playerTagNames";
import type {
    PlayerTagListResponse,
    PlayerTagNameListResponse,
    UpdatePlayerTagNamePayload,
} from "@/types/playerTag";

let playerTagNamesStore = [...mockPlayerTagNames];
let playerTagListStore = [...mockPlayerTagList];

const syncListTagNamesByColor = () => {
    playerTagListStore = playerTagListStore.map((row) => {
        const matchedTag = playerTagNamesStore.find(
            (tag) => tag.tagColor === row.tagColor,
        );

        if (!matchedTag) return row;

        return {
            ...row,
            tagName: matchedTag.tagName,
        };
    });
};

export const playerTagHandlers = [
    http.get("/api/playerTag/list", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 10);
        const keyword = url.searchParams.get("keyword")?.trim() || "";
        const tagName = url.searchParams.get("tagName")?.trim() || "";
        const country = url.searchParams.get("country")?.trim() || "";

        let filteredList = [...playerTagListStore];

        if (keyword) {
            filteredList = filteredList.filter((item) =>
                item.playerName.toLowerCase().includes(keyword.toLowerCase()),
            );
        }

        if (tagName) {
            filteredList = filteredList.filter(
                (item) => item.tagName === tagName,
            );
        }

        if (country) {
            filteredList = filteredList.filter(
                (item) => item.country === country,
            );
        }

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const list = filteredList.slice(start, end);

        const data: PlayerTagListResponse = {
            list,
            total: filteredList.length,
            page,
            pageSize,
        };

        return HttpResponse.json(data);
    }),

    http.get("/api/playerTag/names", () => {
        const data: PlayerTagNameListResponse = {
            list: playerTagNamesStore,
        };

        return HttpResponse.json(data);
    }),

    http.put("/api/playerTag/names", async ({ request }) => {
        const body = (await request.json()) as UpdatePlayerTagNamePayload;

        playerTagNamesStore = playerTagNamesStore.map((item) => {
            const updated = body.list.find((target) => target.id === item.id);
            if (!updated) return item;

            return {
                ...item,
                tagName: updated.tagName.trim(),
            };
        });

        syncListTagNamesByColor();

        const data: PlayerTagNameListResponse = {
            list: playerTagNamesStore,
        };

        return HttpResponse.json(data);
    }),

    http.get("/api/playerTag/tag-options", () => {
        const tagNames = playerTagNamesStore.map((item) => item.tagName);

        return HttpResponse.json({ list: tagNames });
    }),

    http.get("/api/playerTag/country-options", () => {
        const countries = [
            ...new Set(playerTagListStore.map((item) => item.country)),
        ].sort();

        return HttpResponse.json({ list: countries });
    }),
];
