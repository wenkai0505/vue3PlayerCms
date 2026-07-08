export interface PlayerListItem {
    id: string;
    name: string;
    country: string;
}

export interface PlayerListQuery {
    keyword?: string;
    page?: number;
    pageSize?: number;
}

export interface PlayerListResponse {
    list: PlayerListItem[];
    total: number;
}
