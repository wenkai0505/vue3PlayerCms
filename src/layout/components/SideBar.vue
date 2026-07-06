<template>
    <aside class="sidebar" :class="{ isCollapsed: collapsed }">
        <!-- 頂部收合鈕 -->
        <div class="sidebarToggle">
            <button class="sidebarToggleBtn" @click="handleToggle">
                <img
                    class="sidebarToggleIcon"
                    :src="iconSidebar"
                    alt="toggle"
                />
            </button>
        </div>

        <!-- 選單列表 -->
        <nav class="sidebarMenu">
            <RouterLink
                v-for="item in menuList"
                :key="item.key"
                :to="item.path"
                class="menuItem"
                :class="{ isActive: checkActive(item.path) }"
            >
                <img class="menuIcon" :src="item.icon" :alt="item.label" />
                <span v-if="!collapsed" class="menuLabel">
                    {{ item.label }}
                </span>
            </RouterLink>
        </nav>

        <!-- 底部語言切換 -->
        <div class="sidebarFooter">
            <button class="sidebarLang">
                <img class="sidebarLangIcon" :src="iconLang" alt="language" />
                <span v-if="!collapsed">繁體中文</span>
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import iconSidebar from "@/assets/sidebar-expand.svg";
import iconLang from "@/assets/language.svg";

import iconTimeline from "@/assets/timeline.svg";
import iconPlayerTag from "@/assets/note-edit.svg";
import iconProfile from "@/assets/user.svg";
import iconBackpack from "@/assets/backpack.svg";
import iconTexas from "@/assets/poker.svg";
import iconShortDeck from "@/assets/short-deck.svg";
import iconAllin from "@/assets/all-in-or-fold.svg";
import iconOmaha from "@/assets/omaha.svg";
import iconSquid from "@/assets/squid.svg";
import iconThunder from "@/assets/thunder.svg";
import iconOfc from "@/assets/13.svg";
import icon13 from "@/assets/table.svg";
import iconTournament from "@/assets/champion.svg";
import iconEarnings from "@/assets/earnings.svg";

const route = useRoute();
const userCollapsed = ref(false);
const isMobile = ref(false);

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
let mobileMediaQuery: MediaQueryList | null = null;

const collapsed = computed(() => isMobile.value || userCollapsed.value);

const syncMobileState = (matches: boolean) => {
    isMobile.value = matches;
};

const handleToggle = () => {
    if (isMobile.value) return;
    userCollapsed.value = !userCollapsed.value;
};

const handleMobileChange = (event: MediaQueryListEvent) => {
    syncMobileState(event.matches);
};

onMounted(() => {
    mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    syncMobileState(mobileMediaQuery.matches);
    mobileMediaQuery.addEventListener("change", handleMobileChange);
});

onBeforeUnmount(() => {
    mobileMediaQuery?.removeEventListener("change", handleMobileChange);
});

// 靜態資料，後續改為 API / 權限選單
const menuList = [
    { key: "timeline", label: "時間軸", icon: iconTimeline, path: "/timeline" },
    {
        key: "player-tag",
        label: "玩家標記",
        icon: iconPlayerTag,
        path: "/player-tag",
    },
    { key: "profile", label: "個人資料", icon: iconProfile, path: "/profile" },
    {
        key: "backpack",
        label: "背包道具",
        icon: iconBackpack,
        path: "/backpack",
    },
    { key: "texas", label: "德州撲克", icon: iconTexas, path: "/texas" },
    {
        key: "short-deck",
        label: "短牌",
        icon: iconShortDeck,
        path: "/short-deck",
    },
    {
        key: "all-in",
        label: "全押或棄牌",
        icon: iconAllin,
        path: "/all-in-or-fold",
    },
    { key: "omaha", label: "奧馬哈", icon: iconOmaha, path: "/omaha" },
    { key: "squid", label: "魷魚遊戲", icon: iconSquid, path: "/squid" },
    { key: "thunder", label: "閃電", icon: iconThunder, path: "/thunder" },
    { key: "ofc", label: "大波羅", icon: iconOfc, path: "/ofc" },
    { key: "13", label: "13張", icon: icon13, path: "/thirteen" },
    {
        key: "tournament",
        label: "錦標賽",
        icon: iconTournament,
        path: "/tournament",
    },
    {
        key: "earnings",
        label: "收益分析",
        icon: iconEarnings,
        path: "/earnings",
    },
];

const checkActive = (path: string) => route.path === path;
</script>

<style scoped lang="scss">
.sidebar {
    @include box(var(--sidebar-width), 100%);
    @include flex(stretch, flex-start);
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    background: var(--dark-neutral-800);
    transition: width 0.2s ease;

    @include mobile {
        width: 72px;
    }

    .sidebarToggle {
        padding: 10px;

        @include mobile {
            padding: 10px 8px;
        }
    }
    .sidebarToggleBtn {
        @include flex;
        @include box(45px, 45px);
        position: relative;
        overflow: hidden;
        border: 0.5px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        background: var(--surface-overlay);
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .sidebarToggleIcon {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease;
    }

    .sidebarMenu {
        @include flex(stretch, flex-start);
        flex: 1;
        flex-direction: column;
        gap: 4px;
        margin: 0 12px;
        padding: 12px;
        background: var(--dark-neutral-900);
        border-radius: var(--radius-md);

        @include mobile {
            margin: 0 8px;
            padding: 12px 8px;
        }
    }

    .sidebarFooter {
        padding: 12px;
    }

    .sidebarLang {
        @include flex;
        @include box(100%, auto);
        gap: 8px;
        padding: 8px 20px;
        border: 0.5px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        background: var(--surface-overlay);
        color: var(--text-primary);
        font-size: 13px;
        font-weight: 700;
        transition:
            background-color 0.2s ease,
            color 0.2s ease;

        @include mobile {
            justify-content: center;
            padding: 8px;
        }
    }

    .sidebarLangIcon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        transition: filter 0.2s ease;
    }

    @include mobile {
        .sidebarToggleIcon {
            transform: rotate(180deg);
        }
    }

    &.isCollapsed {
        width: 72px;

        .sidebarToggle {
            padding: 10px 8px;
        }

        .sidebarMenu {
            margin: 0 8px;
            padding: 12px 8px;
        }

        .sidebarLang {
            justify-content: center;
            padding: 8px;
        }

        .sidebarToggleIcon {
            transform: rotate(180deg);
        }
    }
}

.menuItem {
    @include flex(center, flex-start);
    @include box(180px, auto);
    align-self: center;
    gap: 8px;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    color: var(--gray-500);
    font-size: 11px;
    line-height: 14px;
    transition:
        background-color 0.2s ease,
        color 0.2s ease,
        opacity 0.2s ease;

    &:not(.isActive):hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.04);

        .menuIcon {
            filter: brightness(1.15);
        }
    }

    .menuIcon {
        @include box(18px, 18px);
        flex-shrink: 0;
        transition: filter 0.2s ease;
    }

    .menuLabel {
        white-space: nowrap;
    }

    &.isActive {
        color: var(--text-primary);
        background: var(--menu-item-active-bg);

        .menuIcon {
            filter: brightness(0) saturate(100%) invert(35%) sepia(91%)
                saturate(2278%) hue-rotate(234deg) brightness(102%)
                contrast(101%);
        }
    }

    .sidebar.isCollapsed & {
        @include box(40px, auto);
        justify-content: center;
        padding: 12px 0;
        align-self: center;
    }

    @include mobile {
        @include box(40px, auto);
        justify-content: center;
        padding: 12px 0;
        align-self: center;

        .menuLabel {
            display: none;
        }
    }

    .sidebar.isCollapsed & .menuLabel {
        display: none;
    }

    .sidebar.isCollapsed &.isActive {
        @include box(40px, auto);
        justify-content: center;
        align-self: center;
        padding: 12px 0;
    }
}
</style>
