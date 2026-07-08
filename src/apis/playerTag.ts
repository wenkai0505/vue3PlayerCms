import request from "@/utils/request";
import type {
    PlayerTagListQuery,
    PlayerTagListResponse,
    PlayerTagNameListResponse,
    UpdatePlayerTagNamePayload,
    PlayerTagFilterOptionsResponse,
    PlayerTagCountryOptionsResponse,
    BatchDeletePlayerTagPayload,
    BatchDeletePlayerTagResponse,
    UpdatePlayerTagPayload,
    UpdatePlayerTagResponse,
    CreatePlayerTagPayload,
    CreatePlayerTagResponse,
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

export const batchDeletePlayerTagsApi = (
    payload: BatchDeletePlayerTagPayload,
): Promise<BatchDeletePlayerTagResponse> => {
    return request({
        url: "/playerTag/batch-delete",
        method: "POST",
        data: payload,
    });
};

export const updatePlayerTagApi = (
    payload: UpdatePlayerTagPayload,
): Promise<UpdatePlayerTagResponse> => {
    return request({
        url: "/playerTag/item",
        method: "PUT",
        data: payload,
    });
};

export const createPlayerTagApi = (
    payload: CreatePlayerTagPayload,
): Promise<CreatePlayerTagResponse> => {
    return request({
        url: "/playerTag/item",
        method: "POST",
        data: payload,
    });
};
