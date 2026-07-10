<template>
    <article class="timelineRow">
        <div class="timelineRow__time">
            <time class="timelineRow__date">{{ dateText }}</time>
            <time class="timelineRow__clock">{{ timeText }}</time>
        </div>

        <TimelineCard
            :event="event"
            :expanded="expanded"
            @toggle="emit('toggle', $event)"
        />
    </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TimelineCard from "./TimelineCard.vue";
import {
    formatTimelineDate,
    formatTimelineTime,
} from "@/composables/useTimelineFormat";
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

const dateText = computed(() => formatTimelineDate(props.event.occurredAt));
const timeText = computed(() => formatTimelineTime(props.event.occurredAt));
</script>

<style scoped lang="scss">
.timelineRow {
    @include flex(flex-start, flex-start);
    gap: 40px;
    width: 100%;
    padding: var(--space-sm);
    border-radius: var(--radius-md);
    background: var(--dark-neutral-900);

    @include mobile {
        flex-direction: column;
        gap: var(--space-xs);
    }

    &__time {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        flex-shrink: 0;
        width: 106px;
        white-space: nowrap;

        @include mobile {
            width: 100%;
            flex-direction: row;
            align-items: baseline;
            gap: var(--space-sm);
        }
    }

    &__date {
        @include text-body-bold;
        color: var(--text-primary);
    }

    &__clock {
        font-size: var(--font-size-body);
        line-height: 1.3;
        letter-spacing: 1.3px;
        color: var(--text-placeholder);
    }
}
</style>
