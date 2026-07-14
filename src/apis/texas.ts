import request from "@/utils/request";
import type {
    TexasBaseQuery,
    TexasHandsHighlightResponse,
    TexasSessionListQuery,
    TexasSessionListResponse,
    TexasSessionsExportResponse,
    TexasStreetStatsResponse,
    TexasSummaryResponse,
} from "@/types/texas";

const withPlayerPath = (playerId: string, path: string) =>
    `/texas/${playerId}${path}`;

export const getTexasSummaryApi = (
    params: TexasBaseQuery,
): Promise<TexasSummaryResponse> => {
    const { playerId, ...query } = params;
    return request({
        url: withPlayerPath(playerId, "/summary"),
        method: "GET",
        params: query,
    });
};

export const getTexasStreetStatsApi = (
    params: TexasBaseQuery,
): Promise<TexasStreetStatsResponse> => {
    const { playerId, ...query } = params;
    return request({
        url: withPlayerPath(playerId, "/street-stats"),
        method: "GET",
        params: query,
    });
};

/** 最強 / 最弱手牌 */
export const getTexasHandsHighlightApi = (
    params: TexasBaseQuery,
): Promise<TexasHandsHighlightResponse> => {
    const { playerId, ...query } = params;
    return request({
        url: withPlayerPath(playerId, "/hands-highlight"),
        method: "GET",
        params: query,
    });
};

export const getTexasSessionListApi = (
    params: TexasSessionListQuery,
): Promise<TexasSessionListResponse> => {
    const { playerId, ...query } = params;
    return request({
        url: withPlayerPath(playerId, "/sessions"),
        method: "GET",
        params: query,
    });
};

/** TODO: 匯出 Excel 真實格式待後端確認 */
export const exportTexasSessionsApi = (
    params: TexasBaseQuery & { stakes?: string },
): Promise<TexasSessionsExportResponse> => {
    const { playerId, ...query } = params;
    return request({
        url: withPlayerPath(playerId, "/sessions/export"),
        method: "GET",
        params: query,
    });
};
