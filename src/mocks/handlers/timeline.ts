import { http, HttpResponse } from "msw";
import { mockTimelineEvents, mockTimelineFilterOptions } from "@/mock/timeline";
import type {
    TimelineCategory,
    TimelineListResponse,
    TimelinePreset,
} from "@/types/timeline";

/** YYYY-MM-DD → Date（當天 00:00） */
const parseDateOnly = (value: string) => {
    const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

/** 依 preset 算出起迄時間（對齊 PageDateTopbar：從區間起點到今天） */
const getPresetRange = (preset: TimelinePreset) => {
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

    // 預設本月
    return { start: new Date(year, month, 1), end };
};

/** 解析 categories=a,b 字串 */
const parseCategories = (url: URL): TimelineCategory[] => {
    const raw = url.searchParams.get("categories") || "";
    if (!raw) return [];
    return raw.split(",").filter(Boolean) as TimelineCategory[];
};

export const timelineHandlers = [
    http.get("/api/timeline/filter-options", () => {
        return HttpResponse.json({ list: mockTimelineFilterOptions });
    }),

    http.get("/api/timeline/:playerId/list", ({ request, params }) => {
        const url = new URL(request.url);
        const playerId = String(params.playerId);
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 20);
        const preset =
            (url.searchParams.get("preset") as TimelinePreset) || "month";
        const startDate = url.searchParams.get("startDate") || "";
        const endDate = url.searchParams.get("endDate") || "";
        const categories = parseCategories(url);

        // 1. 先依玩家過濾
        let list = mockTimelineEvents.filter(
            (item) => item.playerId === playerId,
        );

        // 2. 再依分類過濾（有勾選才過濾）
        if (categories.length > 0) {
            list = list.filter((item) => categories.includes(item.category));
        }

        // 3. 再依日期過濾（自訂區間優先，否則用 preset）
        let rangeStart: Date;
        let rangeEnd: Date;

        if (startDate && endDate) {
            rangeStart = parseDateOnly(startDate);
            rangeEnd = parseDateOnly(endDate);
            rangeEnd.setHours(23, 59, 59, 999);
        } else {
            const range = getPresetRange(preset);
            rangeStart = range.start;
            rangeEnd = range.end;
        }

        list = list.filter((item) => {
            const time = new Date(item.occurredAt).getTime();
            return time >= rangeStart.getTime() && time <= rangeEnd.getTime();
        });

        // 4. 新到舊排序
        list.sort(
            (a, b) =>
                new Date(b.occurredAt).getTime() -
                new Date(a.occurredAt).getTime(),
        );

        // 5. 分頁
        const start = (page - 1) * pageSize;
        const data: TimelineListResponse = {
            list: list.slice(start, start + pageSize),
            total: list.length,
            page,
            pageSize,
        };

        return HttpResponse.json(data);
    }),
];
