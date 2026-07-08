import type { PlayerTagRow } from "@/types/playerTag";
import { mockPlayerTagNames } from "@/mock/playerTagNames";

const getTagById = (id: string) => {
    const tag = mockPlayerTagNames.find((item) => item.id === id);
    if (!tag) {
        throw new Error(`Tag not found: ${id}`);
    }
    return tag;
};

const withTag = (
    tagId: string,
    row: Omit<PlayerTagRow, "tagId" | "tagName" | "tagColor">,
): PlayerTagRow => {
    const tag = getTagById(tagId);

    return {
        ...row,
        tagId: tag.id,
        tagName: tag.tagName,
        tagColor: tag.tagColor,
    };
};

export const mockPlayerTagList: PlayerTagRow[] = [
    withTag("5", {
        id: "1",
        playerId: "p1",
        playerName: "LeBron",
        country: "台灣",
        content: "內容範例 1",
        note: "三分球高手，隊伍核心。",
        modifiedAt: "2025/09/20, 18:32",
    }),
    withTag("3", {
        id: "4",
        playerId: "p4",
        playerName: "Luka",
        country: "澳門",
        content: "內容範例 2",
        note: "關鍵時刻總能得分。",
        modifiedAt: "2025/08/09, 09:50",
    }),
    withTag("5", {
        id: "5",
        playerId: "p5",
        playerName: "Steph",
        country: "馬來西亞",
        content: "內容範例 3",
        note: "遠射精準，控球穩健。",
        modifiedAt: "2025/07/22, 21:20",
    }),
    withTag("1", {
        id: "6",
        playerId: "p6",
        playerName: "Jimmy",
        country: "新加坡",
        content: "內容範例 4",
        note: "防守端表現突出。",
        modifiedAt: "2025/06/14, 15:11",
    }),
    withTag("4", {
        id: "7",
        playerId: "p7",
        playerName: "Kobe",
        country: "台灣",
        content: "內容範例 5",
        note: "比賽關鍵人物。",
        modifiedAt: "2025/05/03, 10:58",
    }),
    withTag("5", {
        id: "8",
        playerId: "p8",
        playerName: "Jordan",
        country: "中國",
        content: "內容範例 6",
        note: "籃板搶得一流。",
        modifiedAt: "2025/04/11, 07:45",
    }),
    withTag("6", {
        id: "9",
        playerId: "p9",
        playerName: "Giannis",
        country: "香港",
        content: "內容範例 7",
        note: "技術全面，未來可期。",
        modifiedAt: "2025/02/19, 19:22",
    }),
    withTag("3", {
        id: "10",
        playerId: "p10",
        playerName: "Kevin",
        country: "日本",
        content: "內容範例 8",
        note: "攻守兼備，效率極高。",
        modifiedAt: "2025/01/16, 13:40",
    }),
    withTag("2", {
        id: "11",
        playerId: "p11",
        playerName: "Irving",
        country: "韓國",
        content: "內容範例 9",
        note: "運球速度快，穿透力強。",
        modifiedAt: "2024/12/30, 09:00",
    }),
    withTag("1", {
        id: "12",
        playerId: "p12",
        playerName: "Nikola",
        country: "台灣",
        content: "內容範例 10",
        note: "組織進攻能力強。",
        modifiedAt: "2025/03/25, 14:30",
    }),
    withTag("4", {
        id: "13",
        playerId: "p13",
        playerName: "Zion",
        country: "澳門",
        content: "內容範例 11",
        note: "強力灌籃，觀眾最愛。",
        modifiedAt: "2025/02/08, 20:56",
    }),
    withTag("6", {
        id: "14",
        playerId: "p14",
        playerName: "Chris",
        country: "馬來西亞",
        content: "內容範例 12",
        note: "外圍投射準確。",
        modifiedAt: "2025/01/01, 16:32",
    }),
    withTag("3", {
        id: "15",
        playerId: "p15",
        playerName: "James",
        country: "新加坡",
        content: "內容範例 13",
        note: "臨危不亂，穩定發揮。",
        modifiedAt: "2025/03/18, 18:47",
    }),
];

export const mockPlayerTagResponse = {
    list: mockPlayerTagList,
    total: mockPlayerTagList.length,
    page: 1,
    pageSize: 10,
};
