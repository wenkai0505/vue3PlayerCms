<template>
    <span class="playingCard" :class="{ isRed: isRedSuit(card.suit) }">
        <span class="rank">{{ displayRank }}</span>
        <span class="suit">{{ getSuitSymbol(card.suit) }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getSuitSymbol, isRedSuit } from "@/composables/useTexasFormat";
import type { PlayingCard } from "@/types/texas";

interface Props {
    card: PlayingCard;
}

const props = defineProps<Props>();

const displayRank = computed(() =>
    props.card.rank === "T" ? "10" : props.card.rank,
);
</script>

<style scoped lang="scss">
.playingCard {
    @include box(28px, 38px);
    @include flex;
    flex-direction: column;
    gap: 1px;
    border-radius: 4px;
    background: #f5f7fb;
    color: #1a1a1a;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
    flex-shrink: 0;

    &.isRed {
        color: #d64545;
    }

    .rank {
        font-size: 11px;
        font-weight: 700;
        line-height: 12px;
    }

    .suit {
        font-size: 11px;
        line-height: 12px;
    }
}
</style>
