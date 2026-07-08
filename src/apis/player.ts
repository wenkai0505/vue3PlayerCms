import request from "@/utils/request";
import type { PlayerListQuery, PlayerListResponse } from "@/types/player";

export const getAllPlayersApi = (): Promise<PlayerListResponse> => {
    return request({ url: "/players/list", method: "GET" });
};

export const searchPlayersApi = (
    params: PlayerListQuery,
): Promise<PlayerListResponse> => {
    return request({ url: "/players/list", method: "GET", params });
};
