import { http, HttpResponse } from "msw";
import { mockPlayerTagList } from "@/mock/playerTag";
import { mockPlayerTagNames } from "@/mock/playerTagNames";
import { mockPlayers } from "@/mock/players";
import type {
    PlayerTagListResponse,
    PlayerTagNameListResponse,
    UpdatePlayerTagNamePayload,
    PlayerTagRow,
    PlayerTagSortField,
    SortOrder,
    BatchDeletePlayerTagPayload,
    BatchDeletePlayerTagResponse,
    UpdatePlayerTagPayload,
    UpdatePlayerTagResponse,
    CreatePlayerTagPayload,
    CreatePlayerTagResponse,
} from "@/types/playerTag";

let playerTagNamesStore = [...mockPlayerTagNames];
let playerTagListStore = [...mockPlayerTagList];

const syncListTagNamesByTagId = () => {
    playerTagListStore = playerTagListStore.map((row) => {
        const matchedTag = playerTagNamesStore.find(
            (tag) => tag.id === row.tagId,
        );

        if (!matchedTag) return row;

        return {
            ...row,
            tagName: matchedTag.tagName,
            tagColor: matchedTag.tagColor,
        };
    });
};

const parseModifiedAt = (value: string) => {
    const [datePart = "", timePart = ""] = value.split(", ");
    const [year = 0, month = 1, day = 1] = datePart.split("/").map(Number);
    const [hour = 0, minute = 0] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute).getTime();
};

const formatModifiedAt = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day}, ${hour}:${minute}`;
};

const sortPlayerTagList = (
    list: PlayerTagRow[],
    sortBy: PlayerTagSortField,
    sortOrder: SortOrder,
) => {
    const sorted = [...list];

    sorted.sort((a, b) => {
        let result = 0;

        if (sortBy === "modifiedAt") {
            result =
                parseModifiedAt(a.modifiedAt) - parseModifiedAt(b.modifiedAt);
        } else {
            result = String(a[sortBy]).localeCompare(
                String(b[sortBy]),
                "zh-Hant",
            );
        }

        return sortOrder === "asc" ? result : -result;
    });

    return sorted;
};

export const playerTagHandlers = [
    http.get("/api/playerTag/list", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 10);
        const keyword = url.searchParams.get("keyword")?.trim() || "";
        const tagName = url.searchParams.get("tagName")?.trim() || "";
        const country = url.searchParams.get("country")?.trim() || "";
        const sortBy =
            (url.searchParams.get("sortBy") as PlayerTagSortField) ||
            "modifiedAt";
        const sortOrder =
            (url.searchParams.get("sortOrder") as SortOrder) || "desc";

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

        filteredList = sortPlayerTagList(filteredList, sortBy, sortOrder);

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

        syncListTagNamesByTagId();

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

    http.post("/api/playerTag/batch-delete", async ({ request }) => {
        const body = (await request.json()) as BatchDeletePlayerTagPayload;
        const targetSet = new Set(body.tagIds);
        const beforeCount = playerTagListStore.length;
        playerTagListStore = playerTagListStore.filter(
            (row) => !targetSet.has(row.tagId),
        );
        const deletedCount = beforeCount - playerTagListStore.length;
        const data: BatchDeletePlayerTagResponse = { deletedCount };
        return HttpResponse.json(data);
    }),

    http.post("/api/playerTag/item", async ({ request }) => {
        const body = (await request.json()) as CreatePlayerTagPayload;

        const matchedPlayer = mockPlayers.find(
            (item) => item.id === body.playerId,
        );
        if (!matchedPlayer) {
            return HttpResponse.json(
                { message: "Player not found" },
                { status: 404 },
            );
        }

        const matchedTag = playerTagNamesStore.find(
            (tag) => tag.id === body.tagId,
        );
        if (!matchedTag) {
            return HttpResponse.json(
                { message: "Tag not found" },
                { status: 400 },
            );
        }

        const duplicated = playerTagListStore.some(
            (item) => item.playerId === body.playerId,
        );
        if (duplicated) {
            return HttpResponse.json(
                { message: "Player tag already exists" },
                { status: 409 },
            );
        }

        const nextId = String(
            Math.max(
                0,
                ...playerTagListStore.map((item) => Number(item.id) || 0),
            ) + 1,
        );

        const newItem: PlayerTagRow = {
            id: nextId,
            playerId: matchedPlayer.id,
            playerName: matchedPlayer.name,
            country: matchedPlayer.country,
            content: body.content.trim(),
            tagId: matchedTag.id,
            tagName: matchedTag.tagName,
            tagColor: matchedTag.tagColor,
            note: body.note.trim(),
            modifiedAt: formatModifiedAt(),
        };

        playerTagListStore = [newItem, ...playerTagListStore];

        const data: CreatePlayerTagResponse = { item: newItem };
        return HttpResponse.json(data);
    }),

    http.put("/api/playerTag/item", async ({ request }) => {
        const body = (await request.json()) as UpdatePlayerTagPayload;
        const matchedTag = playerTagNamesStore.find(
            (tag) => tag.id === body.tagId,
        );

        if (!matchedTag) {
            return HttpResponse.json(
                { message: "Tag not found" },
                { status: 400 },
            );
        }

        let updatedItem: PlayerTagRow | null = null;

        playerTagListStore = playerTagListStore.map((item) => {
            if (item.id !== body.id) return item;

            updatedItem = {
                ...item,
                tagId: matchedTag.id,
                tagName: matchedTag.tagName,
                tagColor: matchedTag.tagColor,
                note: body.note,
                modifiedAt: formatModifiedAt(),
            };

            return updatedItem;
        });

        if (!updatedItem) {
            return HttpResponse.json(
                { message: "Player tag not found" },
                { status: 404 },
            );
        }

        const data: UpdatePlayerTagResponse = { item: updatedItem };
        return HttpResponse.json(data);
    }),
];
