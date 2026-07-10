import type { TimelineCategory, TimelineIconKey } from "@/types/timeline";

import iconChart from "@/assets/poker.svg";
import iconWallet from "@/assets/earnings.svg";
import iconMail from "@/assets/note-edit.svg";

/** 各分類對應的卡片底色 */
const categoryColorMap: Record<TimelineCategory, string> = {
    huge_loss: "var(--timeline-loss)",
    unbelievable: "var(--timeline-unbelievable)",
    huge_victory: "var(--timeline-victory)",
    deposit_withdraw: "var(--timeline-deposit)",
    shop: "var(--timeline-shop)",
    system_message: "var(--timeline-system)",
};

/** icon key 對應的 SVG */
const iconMap: Record<TimelineIconKey, string> = {
    chart: iconChart,
    wallet: iconWallet,
    mail: iconMail,
};

export const getCategoryColor = (category: TimelineCategory): string => {
    return categoryColorMap[category];
};

export const getIconSrc = (icon: TimelineIconKey): string => {
    return iconMap[icon];
};
