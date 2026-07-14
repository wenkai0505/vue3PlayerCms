<template>
    <section class="highlightRow" :class="{ isLoading: loading }">
        <!-- 最強手牌 -->
        <article class="highlightPanel">
            <header class="highlightHead">
                <h3 class="highlightTitle">最強手牌</h3>
                <button type="button" class="infoBtn" aria-label="最強手牌說明">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <circle
                            cx="8"
                            cy="8"
                            r="6.25"
                            stroke="currentColor"
                            stroke-width="1.2"
                        />
                        <path
                            d="M8 7.2V11"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                        />
                        <circle cx="8" cy="5.2" r="0.8" fill="currentColor" />
                    </svg>
                </button>
            </header>

            <div class="highlightBody">
                <div v-for="item in best" :key="item.id" class="handItem">
                    <div class="handMain">
                        <p class="handProfit isProfit">
                            {{ formatTexasProfit(item.profit) }}
                        </p>
                        <div class="handMeta">
                            <span class="metaIcon" aria-hidden="true">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="7"
                                        cy="7"
                                        r="5.25"
                                        stroke="currentColor"
                                        stroke-width="1.2"
                                    />
                                    <path
                                        d="M7 4.2V7.2L8.8 8.4"
                                        stroke="currentColor"
                                        stroke-width="1.2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                            <span class="handId">{{ item.handId }}</span>
                            <span class="handDate">{{
                                formatHandDate(item.occurredAt)
                            }}</span>
                        </div>
                    </div>
                    <div class="cards">
                        <TexasPlayingCard
                            v-for="(card, index) in item.holeCards"
                            :key="`${item.id}-${index}`"
                            :card="card"
                        />
                    </div>
                </div>
                <p v-if="!best.length" class="emptyText">暫無資料</p>
            </div>
        </article>

        <!-- 最弱手牌 -->
        <article class="highlightPanel">
            <header class="highlightHead">
                <h3 class="highlightTitle">最弱手牌</h3>
                <button type="button" class="infoBtn" aria-label="最弱手牌說明">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <circle
                            cx="8"
                            cy="8"
                            r="6.25"
                            stroke="currentColor"
                            stroke-width="1.2"
                        />
                        <path
                            d="M8 7.2V11"
                            stroke="currentColor"
                            stroke-width="1.2"
                            stroke-linecap="round"
                        />
                        <circle cx="8" cy="5.2" r="0.8" fill="currentColor" />
                    </svg>
                </button>
            </header>

            <div class="highlightBody">
                <div v-for="item in worst" :key="item.id" class="handItem">
                    <div class="handMain">
                        <p class="handProfit isLoss">
                            {{ formatTexasProfit(item.profit) }}
                        </p>
                        <div class="handMeta">
                            <span class="metaIcon" aria-hidden="true">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="7"
                                        cy="7"
                                        r="5.25"
                                        stroke="currentColor"
                                        stroke-width="1.2"
                                    />
                                    <path
                                        d="M7 4.2V7.2L8.8 8.4"
                                        stroke="currentColor"
                                        stroke-width="1.2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </span>
                            <span class="handId">{{ item.handId }}</span>
                            <span class="handDate">{{
                                formatHandDate(item.occurredAt)
                            }}</span>
                        </div>
                    </div>
                    <div class="cards">
                        <TexasPlayingCard
                            v-for="(card, index) in item.holeCards"
                            :key="`${item.id}-${index}`"
                            :card="card"
                        />
                    </div>
                </div>
                <p v-if="!worst.length" class="emptyText">暫無資料</p>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import TexasPlayingCard from "./TexasPlayingCard.vue";
import { formatTexasProfit } from "@/composables/useTexasFormat";
import type { TexasHighlightHand } from "@/types/texas";

interface Props {
    best?: TexasHighlightHand[];
    worst?: TexasHighlightHand[];
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    best: () => [],
    worst: () => [],
    loading: false,
});

/** Figma：2025-11-8 */
const formatHandDate = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "-";
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
</script>

<style scoped lang="scss">
.highlightRow {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
    min-width: 0;

    &.isLoading {
        opacity: 0.7;
    }

    @include mobile {
        grid-template-columns: 1fr;
    }
}

/* Figma HandsStatsCard：整欄深色面板 */
.highlightPanel {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    padding: 16px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-900);
    box-sizing: border-box;
}

.highlightHead {
    @include flex(center, space-between);
    gap: 8px;
    flex-shrink: 0;

    .highlightTitle {
        margin: 0;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
    }
}

.infoBtn {
    @include flex;
    @include box(20px, 20px);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
        color: var(--text-primary);
    }
}

.highlightBody {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}

/* 列表卡：比面板稍亮 */
.handItem {
    @include flex(center, space-between);
    gap: 16px;
    padding: 12px 14px;
    border-radius: 8px;
    background: var(--dark-neutral-800);
    box-sizing: border-box;
}

.handMain {
    @include flex(flex-start, center);
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.handProfit {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;

    &.isProfit {
        color: var(--chart-green);
    }

    &.isLoss {
        color: var(--chart-red);
    }
}

.handMeta {
    @include flex(center, flex-start);
    gap: 8px;
    min-width: 0;
    color: var(--text-secondary);
    font-size: 12px;
    line-height: 16px;
}

.metaIcon {
    @include flex;
    flex-shrink: 0;
    color: var(--text-secondary);
}

.handId,
.handDate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.handId {
    color: var(--text-secondary);
}

.cards {
    @include flex(center, flex-end);
    gap: 4px;
    flex-shrink: 0;
}

.emptyText {
    margin: auto;
    padding: 24px;
    color: var(--text-secondary);
    text-align: center;
}
</style>
