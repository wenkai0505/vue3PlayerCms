<template>
    <section class="streetRow" :class="{ isLoading: loading }">
        <article v-for="block in blocks" :key="block.street" class="streetCard">
            <header class="streetHead">
                <h3 class="streetTitle">{{ block.title }}</h3>
            </header>

            <div class="streetBody">
                <div
                    v-for="item in block.items"
                    :key="item.key"
                    class="metricRow"
                    :class="{ isCount: item.format === 'count' }"
                >
                    <span class="metricLabel">{{ item.label }}</span>

                    <template v-if="item.format === 'percent'">
                        <div class="metricBarTrack">
                            <div
                                class="metricBarFill"
                                :class="barToneClass(item.value)"
                                :style="{
                                    width: `${clampPercent(item.value)}%`,
                                }"
                            ></div>
                            <span
                                class="metricBarText"
                                :style="barTextStyle(item.value)"
                            >
                                {{ formatTexasPercent(item.value, 0) }}
                            </span>
                        </div>
                    </template>

                    <span v-else class="metricCount">{{ item.value }}</span>
                </div>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import { formatTexasPercent } from "@/composables/useTexasFormat";
import type { TexasStreetBlock } from "@/types/texas";

interface Props {
    blocks?: TexasStreetBlock[];
    loading?: boolean;
}

withDefaults(defineProps<Props>(), {
    blocks: () => [],
    loading: false,
});

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

/** Figma：低百分比偏紅、高百分比偏青 */
const barToneClass = (value: number) => {
    if (value >= 50) return "isHigh";
    if (value <= 0) return "isEmpty";
    return "isLow";
};

/** 百分比文字貼在填滿末端（與稿面 x 落點一致） */
const barTextStyle = (value: number) => {
    const pct = clampPercent(value);

    if (pct <= 0) {
        return {
            left: "0%",
            transform: "translate(8px, -50%)",
        };
    }

    return {
        left: `${pct}%`,
        transform: "translate(-100%, -50%)",
        paddingRight: "8px",
    };
};
</script>

<style scoped lang="scss">
/* Figma Frame 2131328196：1668×204，padding 12，內放 3 張 StatCard */
.streetRow {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    width: 100%;
    min-width: 0;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-900);
    box-sizing: border-box;

    &.isLoading {
        opacity: 0.7;
    }

    @include pad {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    @include mobile {
        grid-template-columns: 1fr;
        padding: 8px;
        gap: 8px;
    }
}

/* StatCard：高 180 */
.streetCard {
    @include flex(stretch, flex-start);
    flex-direction: column;
    min-width: 0;
    min-height: 180px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-800);
    overflow: hidden;
}

/* 標題列高 32，左右 12 */
.streetHead {
    flex-shrink: 0;
    height: 32px;
    padding: 0 12px;
    border-bottom: 1px solid var(--dark-neutral-700);
    box-sizing: border-box;
    @include flex(center, flex-start);

    .streetTitle {
        margin: 0;
        color: var(--text-primary);
        font-size: 16px;
        font-weight: 700;
        line-height: 26px;
    }
}

/* body：上約 20、左右 12，列距 10（列高 20） */
.streetBody {
    @include flex(stretch, flex-start);
    flex-direction: column;
    flex: 1;
    gap: 10px;
    padding: 20px 12px 16px;
    box-sizing: border-box;
}

.metricRow {
    @include flex(center, flex-start);
    gap: 0;
    min-width: 0;
    height: 20px;

    .metricLabel {
        @include box(48px, 20px);
        @include flex(center, flex-start);
        flex-shrink: 0;
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 700;
        line-height: 17px;
    }

    .metricBarTrack {
        position: relative;
        flex: 1;
        min-width: 0;
        height: 20px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
    }

    .metricBarFill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.2s ease;

        &.isLow {
            background: var(--chart-red);
        }

        &.isHigh {
            background: var(--chart-cyan);
        }

        &.isEmpty {
            background: transparent;
        }
    }

    .metricBarText {
        position: absolute;
        top: 50%;
        color: var(--text-primary);
        font-size: 12px;
        font-weight: 700;
        line-height: 15px;
        white-space: nowrap;
        pointer-events: none;
    }

    .metricCount {
        margin-left: 8px;
        color: var(--text-primary);
        font-size: 13px;
        font-weight: 700;
        line-height: 17px;
    }

    &.isCount {
        height: 17px;
    }
}
</style>
