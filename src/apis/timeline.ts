import request from "@/utils/request";
import type {
    TimelineFilterOptionsResponse,
    TimelineListQuery,
    TimelineListResponse,
} from "@/types/timeline";

/** 取得時間軸列表 */
export const getTimelineListApi = (
    params: TimelineListQuery,
): Promise<TimelineListResponse> => {
    const { playerId, categories, ...query } = params;

    return request({
        url: `/timeline/${playerId}/list`,
        method: "GET",
        params: {
            ...query,
            // 陣列改成字串，避免 axios 變成 categories[]
            ...(categories?.length ? { categories: categories.join(",") } : {}),
        },
    });
};

/** 取得過濾選項 */
export const getTimelineFilterOptionsApi =
    (): Promise<TimelineFilterOptionsResponse> => {
        return request({
            url: "/timeline/filter-options",
            method: "GET",
        });
    };
