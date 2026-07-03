<template>
    <aside class="sideBar" :class="{ 'sideBar--collapsed': collapsed }">
        <!-- 頂部收合鈕 -->
        <div class="sideBar__toggle">
            <button class="sideBar__toggleBtn" @click="collapsed = !collapsed">
                <img
                    class="sideBar__toggleIcon"
                    :src="iconSidebar"
                    alt="toggle"
                />
            </button>
        </div>

        <!-- 選單列表 -->
        <nav class="sideBar__menu">
            <RouterLink
                v-for="item in menuList"
                :key="item.key"
                :to="item.path"
                class="menuItem"
                :class="{ 'menuItem--active': isActive(item.path) }"
            >
                <img
                    class="menuItem__icon"
                    :src="item.icon"
                    :alt="item.label"
                />
                <span v-if="!collapsed" class="menuItem__label">
                    {{ item.label }}
                </span>
            </RouterLink>
        </nav>

        <!-- 底部語言切換 -->
        <div class="sideBar__footer">
            <button class="sideBar__lang">
                <img class="sideBar__langIcon" :src="iconLang" alt="language" />
                <span v-if="!collapsed">繁體中文</span>
            </button>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
const collapsed = ref(false);

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

const isActive = (path: string) => route.path === path;
</script>

<style scoped lang="scss">
.sideBar {
    @include box(var(--sidebar-width), 100%);
    @include flex(stretch, flex-start);
    flex-direction: column;
    overflow: hidden;
    background: var(--dark-neutral-800);
    transition: width 0.2s ease;
    &__toggle {
        padding: 12px;
    }
    &__toggleBtn {
        @include flex;
        @include box(56px, 56px);
        position: relative;
        overflow: hidden;
        border: 0.5px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        background: var(--surface-overlay);
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    &__toggleIcon {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease;
    }
    &__menu {
        @include flex(stretch, flex-start);
        flex: 1;
        flex-direction: column;
        gap: 4px;
        margin: 0 12px;
        padding: 12px;
        overflow-y: auto;
        background: var(--dark-neutral-900);
        border-radius: var(--radius-md);
    }
    &__footer {
        padding: 12px;
    }
    &__lang {
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
    }
    &__langIcon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        transition: filter 0.2s ease;
    }
    &--collapsed {
        width: 72px;
        .sideBar__toggle {
            padding: 12px 8px;
        }
        .sideBar__menu {
            margin: 0 8px;
            padding: 12px 8px;
        }
        .sideBar__lang {
            justify-content: center;
            padding: 8px;
        }
        .sideBar__toggleIcon {
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
    &:not(.menuItem--active):hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.04);
        .menuItem__icon {
            filter: brightness(1.15);
        }
    }
    &__icon {
        @include box(18px, 18px);
        flex-shrink: 0;
        transition: filter 0.2s ease;
    }
    &__label {
        white-space: nowrap;
    }
    &--active {
        color: var(--text-primary);
        background: var(--menu-item-active-bg);
        .menuItem__icon {
            filter: brightness(0) saturate(100%) invert(35%) sepia(91%)
                saturate(2278%) hue-rotate(234deg) brightness(102%)
                contrast(101%);
        }
    }
    .sideBar--collapsed & {
        @include box(40px, auto);
        justify-content: center;
        padding: 12px 0;
        align-self: center;
    }
    .sideBar--collapsed &__label {
        display: none;
    }
    .sideBar--collapsed &--active {
        @include box(40px, auto);
        justify-content: center;
        align-self: center;
        padding: 12px 0;
    }
}
</style>
