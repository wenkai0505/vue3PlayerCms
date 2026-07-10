export type TimelineCategory =
    | "huge_loss"
    | "unbelievable"
    | "huge_victory"
    | "deposit_withdraw"
    | "shop"
    | "system_message";

export type TimelinePreset = "year" | "month" | "week";

export type TimelineIconKey = "chart" | "wallet" | "mail";

export interface TimelinePokerDetail {
    imageUrl: string;
    replayUrl?: string;
    downloadUrl?: string;
    shareUrl?: string;
}

export interface TimelinePromotionDetail {
    bannerUrl: string;
    subtitle?: string;
    body?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    shareUrl?: string;
}

export interface TimelineEvent {
    id: string;
    playerId: string;
    category: TimelineCategory;
    occurredAt: string;
    icon: TimelineIconKey;
    title: string;
    tag?: string;
    description?: string;
    expandable: boolean;
    pokerDetail?: TimelinePokerDetail;
    promotionDetail?: TimelinePromotionDetail;
}

export interface TimelineListQuery {
    playerId: string;
    preset?: TimelinePreset;
    startDate?: string;
    endDate?: string;
    categories?: TimelineCategory[];
    page: number;
    pageSize: number;
}

export interface TimelineListResponse {
    list: TimelineEvent[];
    total: number;
    page: number;
    pageSize: number;
}

export interface TimelineFilterOption {
    value: TimelineCategory;
    label: string;
}

export interface TimelineFilterOptionsResponse {
    list: TimelineFilterOption[];
}
