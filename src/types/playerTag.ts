export type PlayerTagColor = string;

export interface PlayerTagRow {
    id: string;
    playerId: string;
    playerName: string;
    country: string;
    content: string;
    tagId: string;
    tagName: string;
    tagColor: PlayerTagColor;
    note: string;
    modifiedAt: string;
}

export type PlayerTagSortField =
    | "tagName"
    | "playerName"
    | "country"
    | "modifiedAt";
export type SortOrder = "asc" | "desc";

export interface PlayerTagListQuery {
    keyword?: string;
    tagName?: string;
    country?: string;
    sortBy?: PlayerTagSortField;
    sortOrder?: SortOrder;
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
    content: string;
    note: string;
    modifiedAt: string;
}

export interface UpdatePlayerTagPayload {
    id: string;
    tagId: string;
    note: string;
}

export interface UpdatePlayerTagResponse {
    item: PlayerTagRow;
}

export interface CreatePlayerTagPayload {
    playerId: string;
    tagId: string;
    content: string;
    note: string;
}

export interface CreatePlayerTagResponse {
    item: PlayerTagRow;
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

export interface BatchDeletePlayerTagPayload {
    tagIds: string[];
}

export interface BatchDeletePlayerTagResponse {
    deletedCount: number;
}

export interface TableHeadTitles {
    label: string;
    key: PlayerTagSortField;
}
