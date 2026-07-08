<template>
    <div class="statusBadges">
        <span
            v-for="badge in badges"
            :key="badge.variant"
            class="statusBadge"
            :class="`is-${badge.variant}`"
        >
            {{ badge.label }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { PlayerStatusBadge } from "@/types/playerProfile";

interface Props {
    badges: PlayerStatusBadge[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.statusBadges {
    @include flex(center, center);
    gap: 12px;
    width: 100%;
    flex-wrap: wrap;
}

.statusBadge {
    @include flex;
    flex: 1 1 0;
    min-width: 0;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0.2px;
    white-space: nowrap;

    &.is-normal {
        background: #00a63e;
        color: #fff;
    }

    &.is-highProfit {
        background: #e17100;
        color: #fff;
    }

    &.is-professional {
        padding: 5px 13px;
        border: 1px solid var(--dark-neutral-700);
        color: var(--text-primary);
        background: transparent;
    }
}
</style>
