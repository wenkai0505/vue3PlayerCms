import type { PlayerProfile } from "@/types/playerProfile";

export const mockPlayerProfiles: Record<string, PlayerProfile> = {
    p100: {
        playerId: "p100",
        avatarUrl: "/avatarUser.png",
        countryCode: "TW",
        statusBadges: [
            { variant: "normal", label: "正常" },
            { variant: "highProfit", label: "高營利玩家" },
            { variant: "professional", label: "職業選手" },
        ],
        accountNo: "RicoChill**",
        agentPlayerNo: "1115schow880",
        referralCode: "CX1183",
        agentName: "天星娛樂",
        lastLoginAt: "2025/11/01 12:35",
        lastLoginIp: "160.251.230.110",
        lastLoginDevice: "iOS",
    },
};
