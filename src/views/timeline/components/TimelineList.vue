<template>
    <section class="timelineList">
        <div v-if="loading" class="timelineList__state">載入中...</div>

        <div v-else-if="!events.length" class="timelineList__state">
            暫無時間軸資料
        </div>

        <div v-else class="timelineList__items">
            <TimelineRow
                v-for="event in events"
                :key="event.id"
                :event="event"
                :expanded="expandedIds.has(event.id)"
                @toggle="emit('toggle', $event)"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import TimelineRow from "./TimelineRow.vue";
import type { TimelineEvent } from "@/types/timeline";

interface Props {
    events: TimelineEvent[];
    loading?: boolean;
    expandedIds: Set<string>;
}

withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits<{
    (e: "toggle", id: string): void;
}>();
</script>

<style scoped lang="scss">
.timelineList {
    @include box(100%, auto);
    min-width: 0;

    &__items {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
    }

    &__state {
        @include flex;
        min-height: 160px;
        font-size: var(--font-size-body);
        color: var(--text-secondary);
    }
}
</style>
