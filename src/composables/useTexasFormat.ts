import type { CardSuit } from "@/types/texas";

export const formatTexasPercent = (value: number, digits = 2) => {
    const fixed = Number.isInteger(value)
        ? String(value)
        : value.toFixed(digits);
    return `${fixed}%`;
};

export const formatTexasProfit = (value: number, withSign = true) => {
    const abs = Math.abs(value).toFixed(2);
    if (!withSign) return `$${abs}`;
    if (value > 0) return `+$${abs}`;
    if (value < 0) return `-$${abs}`;
    return `$${abs}`;
};

export const formatTexasDateTime = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "-";

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
};

export const getSuitSymbol = (suit: CardSuit) => {
    const map: Record<CardSuit, string> = {
        s: "♠",
        h: "♥",
        d: "♦",
        c: "♣",
    };
    return map[suit];
};

export const isRedSuit = (suit: CardSuit) => suit === "h" || suit === "d";
