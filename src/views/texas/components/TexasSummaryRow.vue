<template>
    <section class="summaryRow" :class="{ isLoading: loading }">
        <!-- 牌局總數量 -->
        <article class="kpiShell">
            <div class="kpiCard handsCard">
                <div class="kpiMain">
                    <p class="kpiLabel">牌局總數量</p>
                    <p class="kpiValue">{{ handsText }}</p>
                </div>
                <div class="sparkline" aria-hidden="true">
                    <svg viewBox="0 0 120 48" preserveAspectRatio="none">
                        <path
                            class="sparkArea"
                            d="M0 36 C16 34 24 20 40 22 C56 24 64 38 80 30 C96 22 108 10 120 14 L120 48 L0 48 Z"
                        />
                        <path
                            class="sparkLine"
                            d="M0 36 C16 34 24 20 40 22 C56 24 64 38 80 30 C96 22 108 10 120 14"
                        />
                    </svg>
                </div>
            </div>
        </article>

        <!-- 玩家勝率 -->
        <article class="kpiShell">
            <div class="kpiCard winRateCard">
                <div class="kpiMain">
                    <p class="kpiLabel">玩家勝率</p>
                    <p class="kpiValue">{{ winRateText }}</p>
                </div>
                <div
                    class="donut"
                    :style="{ background: winRateDonut }"
                    aria-hidden="true"
                >
                    <div class="donutHole">
                        <span class="donutValue">{{ winRateText }}</span>
                        <span class="donutLabel">玩家勝率</span>
                    </div>
                </div>
            </div>
        </article>

        <!-- Player Stats -->
        <article class="kpiShell">
            <div class="kpiCard playerStatsCard">
                <div class="statsLeft">
                    <div
                        v-for="item in playerStatItems"
                        :key="item.key"
                        class="statItem"
                    >
                        <p class="kpiLabel">{{ item.label }}</p>
                        <p class="kpiValue sm">
                            {{ formatTexasPercent(item.value, 0) }}
                        </p>
                    </div>
                </div>
                <div
                    class="donut multi"
                    :style="{ background: playerStatsDonut }"
                    aria-hidden="true"
                >
                    <div class="donutHole compact">
                        <span class="donutLabel">Player Stats</span>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatTexasPercent } from "@/composables/useTexasFormat";
import type { TexasSummaryResponse } from "@/types/texas";

interface Props {
    summary?: TexasSummaryResponse | null;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    summary: null,
    loading: false,
});

const handsText = computed(() => {
    const value = props.summary?.totalHands ?? 0;
    return value.toLocaleString("en-US");
});

const winRateText = computed(() =>
    formatTexasPercent(props.summary?.winRate ?? 0),
);

const winRateDonut = computed(() => {
    const rate = Math.min(100, Math.max(0, props.summary?.winRate ?? 0));
    return `conic-gradient(var(--chart-cyan) 0 ${rate}%, rgba(255,255,255,0.12) ${rate}% 100%)`;
});

const playerStatItems = computed(() => [
    { key: "vpip", label: "VPIP", value: props.summary?.vpip ?? 0 },
    { key: "ats", label: "ATS", value: props.summary?.ats ?? 0 },
    { key: "pfr", label: "PFR", value: props.summary?.pfr ?? 0 },
    { key: "threeBet", label: "3BET", value: props.summary?.threeBet ?? 0 },
]);

const playerStatsDonut = computed(() => {
    const values = playerStatItems.value.map((item) => item.value);
    const total = values.reduce((sum, n) => sum + n, 0) || 1;
    const colors = [
        "var(--chart-purple)",
        "var(--chart-cyan)",
        "var(--chart-orange)",
        "var(--chart-green)",
    ];

    let cursor = 0;
    const stops = values.map((value, index) => {
        const next = cursor + (value / total) * 100;
        const stop = `${colors[index]} ${cursor}% ${next}%`;
        cursor = next;
        return stop;
    });

    return `conic-gradient(${stops.join(", ")})`;
});
</script>

<style scoped lang="scss">
.summaryRow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
    min-width: 0;

    &.isLoading {
        opacity: 0.7;
    }

    @include pad {
        grid-template-columns: 1fr 1fr;
    }

    @include mobile {
        grid-template-columns: 1fr;
    }
}

/* Figma：外層深色底匡 + 12px padding */
.kpiShell {
    min-width: 0;
    padding: 12px;
    background: var(--dark-neutral-900);
    border-radius: var(--radius-md);
}

/* Figma：內層圓角內容卡 */
.kpiCard {
    @include flex(stretch, space-between);
    position: relative;
    min-height: 176px;
    height: 100%;
    padding: 20px 16px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-800);
    gap: 12px;
    overflow: hidden;
    box-sizing: border-box;
}

.kpiMain {
    @include flex(flex-start, center);
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    position: relative;
    z-index: 1;
}

.kpiLabel {
    margin: 0;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 16px;
}

.kpiValue {
    margin: 0;
    color: var(--text-primary);
    font-size: 28px;
    font-weight: 700;
    line-height: 32px;

    &.sm {
        font-size: 22px;
        line-height: 28px;
    }
}

.handsCard {
    .sparkline {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 55%;
        height: 70%;
        opacity: 0.9;
        pointer-events: none;

        svg {
            width: 100%;
            height: 100%;
        }

        .sparkArea {
            fill: rgba(169, 96, 248, 0.18);
        }

        .sparkLine {
            fill: none;
            stroke: var(--color-primary);
            stroke-width: 2;
        }
    }
}

.donut {
    @include box(120px, 120px);
    border-radius: 50%;
    flex-shrink: 0;
    @include flex;
    align-self: center;

    .donutHole {
        @include box(78px, 78px);
        @include flex;
        flex-direction: column;
        gap: 2px;
        border-radius: 50%;
        background: var(--dark-neutral-800);

        &.compact {
            @include box(64px, 64px);
        }
    }

    .donutValue {
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
    }

    .donutLabel {
        color: var(--text-secondary);
        font-size: 11px;
        line-height: 14px;
    }
}

.playerStatsCard {
    .statsLeft {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px 16px;
        flex: 1;
        min-width: 0;
    }

    .statItem {
        min-width: 0;
    }
}
</style>
