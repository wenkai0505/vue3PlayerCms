export type PlayerStatusVariant = "normal" | "highProfit" | "professional";

export type LoginDevice = "iOS" | "Android" | "Web" | string;

export interface PlayerStatusBadge {
    variant: PlayerStatusVariant;
    label: string;
}

export interface PlayerProfile {
    playerId: string;
    avatarUrl: string;
    countryCode: string;
    statusBadges: PlayerStatusBadge[];
    accountNo: string;
    agentPlayerNo: string;
    referralCode: string;
    agentName: string;
    lastLoginAt: string;
    lastLoginIp: string;
    lastLoginDevice: LoginDevice;
}
