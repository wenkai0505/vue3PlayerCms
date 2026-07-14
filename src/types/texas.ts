import type { SortOrder } from "@/types/table";

/** 與 PageDateTopbar 一致 */
export type TexasPreset = "year" | "month" | "week";

/**
 * 共用時間篩選
 * - startDate / endDate：YYYY-MM-DD
 * - 有自訂日期時優先於 preset
 */
export interface TexasBaseQuery {
    playerId: string;
    preset?: TexasPreset;
    startDate?: string;
    endDate?: string;
}

/* =========================
 * A. KPI Summary
 * ========================= */

/**
 * 百分比欄位統一 0~100（例：43.06、50）
 * totalProfit：可負值
 */
export interface TexasSummaryResponse {
    totalHands: number;
    winRate: number;
    /** Player Stats 環圖 */
    vpip: number;
    ats: number;
    pfr: number;
    /** 3BET */
    threeBet: number;
    /** 可選：若後續 KPI 卡要顯示總盈虧可沿用 */
    totalProfit?: number;
    currency?: string;
}

/* =========================
 * B. Street Stats
 * ========================= */

/** 翻牌前 / 轉牌 / 河牌（對齊 Figma） */
export type TexasStreet = "preflop" | "turn" | "river";

/**
 * 各街口指標可不同：
 * - preflop / turn：CB、FCB、CCB、RCB
 * - river：WT、WSD、TAF、Hands
 */
export interface TexasStreetMetricItem {
    key: string;
    label: string;
    value: number;
    /** percent: 0~100；count: 整數（如 Hands） */
    format: "percent" | "count";
}

export interface TexasStreetBlock {
    street: TexasStreet;
    title: string;
    items: TexasStreetMetricItem[];
}

export interface TexasStreetStatsResponse {
    list: TexasStreetBlock[];
}

/* =========================
 * C. 最強 / 最弱手牌
 * ========================= */

export type CardSuit = "s" | "h" | "d" | "c";

export type CardRank =
    | "A"
    | "K"
    | "Q"
    | "J"
    | "T"
    | "9"
    | "8"
    | "7"
    | "6"
    | "5"
    | "4"
    | "3"
    | "2";

export interface PlayingCard {
    rank: CardRank;
    suit: CardSuit;
}

export interface TexasHighlightHand {
    id: string;
    handId: string;
    /** 可負值，例 +1.31 / -2.4 */
    profit: number;
    occurredAt: string;
    holeCards: PlayingCard[];
}

export interface TexasHandsHighlightResponse {
    best: TexasHighlightHand[];
    worst: TexasHighlightHand[];
}

/* =========================
 * D. Sessions（最近遊戲）
 * ========================= */

/**
 * stakes：籌碼篩選，例 "$0.01 / $0.02"
 * TODO: 若後端用 blinds 字串，再對齊命名即可
 */
export type TexasSessionSortField =
    | "startedAt"
    | "stakes"
    | "tableName"
    | "handCount"
    | "duration"
    | "profit";

export interface TexasSessionListQuery extends TexasBaseQuery {
    stakes?: string;
    sortBy?: TexasSessionSortField;
    sortOrder?: SortOrder;
    page: number;
    pageSize: number;
}

export interface TexasSessionRow {
    id: string;
    startedAt: string;
    /** 例 "$0.01 / $0.02" */
    stakes: string;
    tableName: string;
    handCount: number;
    /** HH:MM:SS，例 "00:33:19" */
    duration: string;
    /** 可負值 */
    profit: number;
}

export interface TexasSessionListResponse {
    list: TexasSessionRow[];
    total: number;
    page: number;
    pageSize: number;
}

export interface TexasSessionsExportResponse {
    downloadUrl: string;
}

/* =========================
 * E. 遊戲歷史記錄（Hands 表）
 * TODO: 下方區塊暫緩，型別先不放，之後依 Figma 再加
 * ========================= */
