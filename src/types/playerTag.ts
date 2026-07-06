export const playerTagColors = [
    "#00C7E6", // Chart/Color 2
    "#6EDB5A", // Chart/Color 4
    "#FF8B00", // Chart/Color 6
    "#E63757", // Chart/Color 8
    "#D462F2", // Chart/Color 10
    "#6FA9FF", // Chart/Color 12
] as const;

export type PlayerTagColor = (typeof playerTagColors)[number];

export interface PlayerTagRow {
    id: string;
    playerId: string;
    playerName: string;
    country: string;
    tagId: string;
    tagName: string;
    tagColor: PlayerTagColor;
    note: string;
    modifiedAt: string;
}

export interface PlayerTagListQuery {
    keyword?: string;
    tagName?: string;
    country?: string;
    page: number;
    pageSize: number;
}

export interface PlayerTagCountryOptionsResponse {
    list: string[];
}

export interface PlayerTagListResponse {
    list: PlayerTagRow[];
    total: number;
    page: number;
    pageSize: number;
}

export interface PlayerTagItem {
    id: string;
    tagName: string;
    tagColor: PlayerTagColor;
    note: string;
    modifiedAt: string;
}

export interface UpdatePlayerTagPayload {
    id: string;
    tagName: string;
    tagColor: PlayerTagColor;
    note: string;
}

export interface PlayerTagNameItem {
    id: string;
    tagColor: PlayerTagColor;
    tagName: string;
}

export interface PlayerTagNameListResponse {
    list: PlayerTagNameItem[];
}

export interface UpdatePlayerTagNamePayload {
    list: Array<{
        id: string;
        tagName: string;
    }>;
}

export interface PlayerTagFilterOptionsResponse {
    list: string[];
}
