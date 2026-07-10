<template>
    <div
        class="timelineCard"
        :class="{
            isExpanded: expanded,
            isInteractive: event.expandable,
        }"
        :style="{ backgroundColor: cardColor }"
        :role="event.expandable ? 'button' : undefined"
        :tabindex="event.expandable ? 0 : undefined"
        @click="handleCardClick"
        @keydown.enter.prevent="handleCardClick"
        @keydown.space.prevent="handleCardClick"
    >
        <TimelineCardHeader
            :event="event"
            :expanded="expanded"
            @toggle="emit('toggle', event.id)"
        />

        <TimelineCardDetail v-if="expanded && hasDetail" :event="event" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TimelineCardHeader from "./TimelineCardHeader.vue";
import TimelineCardDetail from "./TimelineCardDetail.vue";
import { getCategoryColor } from "@/composables/useTimelineTheme";
import type { TimelineEvent } from "@/types/timeline";

interface Props {
    event: TimelineEvent;
    expanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    expanded: false,
});

const emit = defineEmits<{
    (e: "toggle", id: string): void;
}>();

const cardColor = computed(() => getCategoryColor(props.event.category));

const hasDetail = computed(
    () => !!props.event.pokerDetail || !!props.event.promotionDetail,
);

const handleCardClick = () => {
    if (!props.event.expandable) return;
    emit("toggle", props.event.id);
};
</script>

<style scoped lang="scss">
.timelineCard {
    @include flex(stretch, flex-start);
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: var(--space-sm);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    text-align: left;
    flex-direction: column;
    gap: var(--space-sm);

    &.isInteractive {
        cursor: pointer;
    }

    &.isExpanded {
        border-color: var(--text-primary);
    }
}
</style>
