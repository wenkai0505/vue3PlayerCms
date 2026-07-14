import { http, HttpResponse } from "msw";
import {
    mockTexasHandsHighlight,
    mockTexasSessions,
    mockTexasStreetStats,
    mockTexasSummary,
} from "@/mock/texas";
import type { SortOrder } from "@/types/table";
import type {
    TexasPreset,
    TexasSessionListResponse,
    TexasSessionRow,
    TexasSessionSortField,
} from "@/types/texas";

const parseDateOnly = (value: string) => {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const getPresetRange = (preset: TexasPreset) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const end = new Date(year, month, day, 23, 59, 59, 999);

    if (preset === "year") {
        return { start: new Date(year, 0, 1), end };
    }

    if (preset === "week") {
        const weekday = now.getDay();
        const mondayOffset = weekday === 0 ? 6 : weekday - 1;
        return {
            start: new Date(year, month, day - mondayOffset),
            end,
        };
    }

    return { start: new Date(year, month, 1), end };
};

const getRange = (url: URL) => {
    const preset = (url.searchParams.get("preset") as TexasPreset) || "month";
    const startDate = url.searchParams.get("startDate") || "";
    const endDate = url.searchParams.get("endDate") || "";

    if (startDate && endDate) {
        const start = parseDateOnly(startDate);
        const end = parseDateOnly(endDate);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }

    return getPresetRange(preset);
};

const inRange = (iso: string, start: Date, end: Date) => {
    const time = new Date(iso).getTime();
    return time >= start.getTime() && time <= end.getTime();
};

const durationToSeconds = (value: string) => {
    const [hh = "0", mm = "0", ss = "0"] = value.split(":");
    return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
};

const sortTexasSessions = (
    list: TexasSessionRow[],
    sortBy: TexasSessionSortField,
    sortOrder: SortOrder,
) => {
    return [...list].sort((a, b) => {
        let result = 0;

        if (sortBy === "startedAt") {
            result =
                new Date(a.startedAt).getTime() -
                new Date(b.startedAt).getTime();
        } else if (sortBy === "handCount" || sortBy === "profit") {
            result = a[sortBy] - b[sortBy];
        } else if (sortBy === "duration") {
            result =
                durationToSeconds(a.duration) - durationToSeconds(b.duration);
        } else {
            result = String(a[sortBy]).localeCompare(
                String(b[sortBy]),
                "zh-Hant",
            );
        }

        return sortOrder === "asc" ? result : -result;
    });
};

export const texasHandlers = [
    http.get("/api/texas/:playerId/summary", () => {
        return HttpResponse.json(mockTexasSummary);
    }),

    http.get("/api/texas/:playerId/street-stats", () => {
        return HttpResponse.json({ list: mockTexasStreetStats });
    }),

    http.get("/api/texas/:playerId/hands-highlight", () => {
        return HttpResponse.json(mockTexasHandsHighlight);
    }),

    http.get("/api/texas/:playerId/sessions", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 10);
        const stakes = (url.searchParams.get("stakes") || "").trim();
        const sortBy =
            (url.searchParams.get("sortBy") as TexasSessionSortField) ||
            "startedAt";
        const sortOrder =
            (url.searchParams.get("sortOrder") as SortOrder) || "desc";
        const { start, end } = getRange(url);

        let list = mockTexasSessions.filter((item) =>
            inRange(item.startedAt, start, end),
        );

        if (stakes) {
            list = list.filter((item) => item.stakes === stakes);
        }

        list = sortTexasSessions(list, sortBy, sortOrder);

        const from = (page - 1) * pageSize;
        const data: TexasSessionListResponse = {
            list: list.slice(from, from + pageSize),
            total: list.length,
            page,
            pageSize,
        };

        return HttpResponse.json(data);
    }),

    http.get("/api/texas/:playerId/sessions/export", () => {
        return HttpResponse.json({
            downloadUrl: "/mock/texas/sessions-export.xlsx",
        });
    }),
];
