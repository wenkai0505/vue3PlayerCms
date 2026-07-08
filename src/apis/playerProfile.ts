import request from "@/utils/request";
import type { PlayerProfile } from "@/types/playerProfile";

export const getPlayerProfileApi = (
    playerId: string,
): Promise<PlayerProfile> => {
    return request({
        url: `/profile/${playerId}`,
        method: "GET",
    });
};
