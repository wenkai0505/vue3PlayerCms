import request from "@/utils/request";
import type {
    PlayerTagListQuery,
    PlayerTagListResponse,
    PlayerTagNameListResponse,
    UpdatePlayerTagNamePayload,
    PlayerTagFilterOptionsResponse,
    PlayerTagCountryOptionsResponse,
} from "@/types/playerTag";

export const getPlayerTagListApi = (
    params: PlayerTagListQuery,
): Promise<PlayerTagListResponse> => {
    return request({
        url: "/playerTag/list",
        method: "GET",
        params,
    });
};

export const getPlayerTagNamesApi = (): Promise<PlayerTagNameListResponse> => {
    return request({
        url: "/playerTag/names",
        method: "GET",
    });
};

export const updatePlayerTagNamesApi = (
    payload: UpdatePlayerTagNamePayload,
): Promise<PlayerTagNameListResponse> => {
    return request({
        url: "/playerTag/names",
        method: "PUT",
        data: payload,
    });
};

export const getPlayerTagFilterOptionsApi =
    (): Promise<PlayerTagFilterOptionsResponse> => {
        return request({
            url: "/playerTag/tag-options",
            method: "GET",
        });
    };

export const getPlayerTagCountryOptionsApi =
    (): Promise<PlayerTagCountryOptionsResponse> => {
        return request({
            url: "/playerTag/country-options",
            method: "GET",
        });
    };
