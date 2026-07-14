import type {
    TexasHandsHighlightResponse,
    TexasSessionRow,
    TexasStreetBlock,
    TexasSummaryResponse,
} from "@/types/texas";

export const MOCK_TEXAS_PLAYER_ID = "p100";

export const mockTexasSummary: TexasSummaryResponse = {
    totalHands: 7738,
    winRate: 43.06,
    vpip: 50,
    ats: 50,
    pfr: 50,
    threeBet: 50,
    totalProfit: 1284.55,
    currency: "USD",
};

export const mockTexasStreetStats: TexasStreetBlock[] = [
    {
        street: "preflop",
        title: "翻牌前",
        items: [
            { key: "cb", label: "CB", value: 28, format: "percent" },
            { key: "fcb", label: "FCB", value: 28, format: "percent" },
            { key: "ccb", label: "CCB", value: 71, format: "percent" },
            { key: "rcb", label: "RCB", value: 0, format: "percent" },
        ],
    },
    {
        street: "turn",
        title: "轉牌",
        items: [
            { key: "cb", label: "CB", value: 28, format: "percent" },
            { key: "fcb", label: "FCB", value: 28, format: "percent" },
            { key: "ccb", label: "CCB", value: 71, format: "percent" },
            { key: "rcb", label: "RCB", value: 0, format: "percent" },
        ],
    },
    {
        street: "river",
        title: "河牌",
        items: [
            { key: "wt", label: "WT", value: 28, format: "percent" },
            { key: "wsd", label: "WSD", value: 28, format: "percent" },
            { key: "taf", label: "TAF", value: 71, format: "percent" },
            { key: "hands", label: "Hands", value: 629, format: "count" },
        ],
    },
];

export const mockTexasHandsHighlight: TexasHandsHighlightResponse = {
    best: [
        {
            id: "hl-best-1",
            handId: "3_1779320225630",
            profit: 1.31,
            occurredAt: "2025-11-08T14:20:00+08:00",
            holeCards: [
                { rank: "A", suit: "d" },
                { rank: "K", suit: "h" },
            ],
        },
        {
            id: "hl-best-2",
            handId: "3_1779320225631",
            profit: 1.18,
            occurredAt: "2025-11-07T21:05:00+08:00",
            holeCards: [
                { rank: "A", suit: "s" },
                { rank: "A", suit: "c" },
            ],
        },
        {
            id: "hl-best-3",
            handId: "3_1779320225632",
            profit: 0.96,
            occurredAt: "2025-11-06T19:40:00+08:00",
            holeCards: [
                { rank: "K", suit: "s" },
                { rank: "K", suit: "d" },
            ],
        },
        {
            id: "hl-best-4",
            handId: "3_1779320225633",
            profit: 0.84,
            occurredAt: "2025-11-05T11:12:00+08:00",
            holeCards: [
                { rank: "Q", suit: "h" },
                { rank: "Q", suit: "c" },
            ],
        },
        {
            id: "hl-best-5",
            handId: "3_1779320225634",
            profit: 0.72,
            occurredAt: "2025-11-04T16:30:00+08:00",
            holeCards: [
                { rank: "A", suit: "h" },
                { rank: "Q", suit: "s" },
            ],
        },
    ],
    worst: [
        {
            id: "hl-worst-1",
            handId: "3_1779320225701",
            profit: -2.4,
            occurredAt: "2025-11-08T18:10:00+08:00",
            holeCards: [
                { rank: "J", suit: "d" },
                { rank: "T", suit: "c" },
            ],
        },
        {
            id: "hl-worst-2",
            handId: "3_1779320225702",
            profit: -1.95,
            occurredAt: "2025-11-07T09:22:00+08:00",
            holeCards: [
                { rank: "9", suit: "h" },
                { rank: "8", suit: "h" },
            ],
        },
        {
            id: "hl-worst-3",
            handId: "3_1779320225703",
            profit: -1.62,
            occurredAt: "2025-11-06T22:48:00+08:00",
            holeCards: [
                { rank: "A", suit: "c" },
                { rank: "T", suit: "d" },
            ],
        },
        {
            id: "hl-worst-4",
            handId: "3_1779320225704",
            profit: -1.41,
            occurredAt: "2025-11-05T13:05:00+08:00",
            holeCards: [
                { rank: "K", suit: "c" },
                { rank: "Q", suit: "d" },
            ],
        },
        {
            id: "hl-worst-5",
            handId: "3_1779320225705",
            profit: -1.2,
            occurredAt: "2025-11-04T20:17:00+08:00",
            holeCards: [
                { rank: "7", suit: "s" },
                { rank: "7", suit: "h" },
            ],
        },
    ],
};

const stakesOptions = [
    "$0.01 / $0.02",
    "$0.05 / $0.10",
    "$0.10 / $0.25",
    "$0.25 / $0.50",
];

const tableNames = [
    "德州撲克",
    "德州撲克 NL",
    "德州撲克 6-Max",
    "德州撲克 全速",
];

const pad = (n: number) => String(n).padStart(2, "0");

const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

/** 28 筆，日期落在 2026，方便 preset 過濾 */
export const mockTexasSessions: TexasSessionRow[] = Array.from(
    { length: 28 },
    (_, index) => {
        const n = index + 1;
        const month = (n % 12) + 1;
        const day = Math.min(28, 1 + (n % 25));
        const mm = pad(month);
        const dd = pad(day);
        const stakes =
            stakesOptions[n % stakesOptions.length] ?? stakesOptions[0]!;
        const profit = Number(
            ((n % 3 === 0 ? -1 : 1) * (0.2 + n * 0.11)).toFixed(2),
        );

        return {
            id: `tx-session-${pad(n)}`,
            startedAt: `2026-${mm}-${dd}T${pad(10 + (n % 8))}:${pad((n * 3) % 60)}:00+08:00`,
            stakes,
            tableName: tableNames[n % tableNames.length] ?? "德州撲克",
            handCount: 20 + (n % 60),
            duration: formatDuration(600 + n * 97),
            profit,
        };
    },
);
