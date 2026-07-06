import { playerTagColors } from "@/types/playerTag";
import type { PlayerTagNameItem } from "@/types/playerTag";

export const mockPlayerTagNames: PlayerTagNameItem[] = [
    { id: "1", tagColor: playerTagColors[0], tagName: "優秀對手" },
    { id: "2", tagColor: playerTagColors[3], tagName: "特殊對象" },
    { id: "3", tagColor: playerTagColors[1], tagName: "職業選手" },
    { id: "4", tagColor: playerTagColors[4], tagName: "VIP" },
    { id: "5", tagColor: playerTagColors[2], tagName: "傳奇玩家" },
    { id: "6", tagColor: playerTagColors[5], tagName: "新手玩家" },
];
