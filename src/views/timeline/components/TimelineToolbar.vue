<template>
    <section class="timelineToolbar">
        <PageDateTopbar
            :preset="preset"
            :start-date="startDate"
            :end-date="endDate"
            :show-filter="true"
            :filter-open="isFilterOpen"
            @update:preset="handlePresetChange"
            @update:dateRange="handleDateRangeChange"
            @toggleFilter="isFilterOpen = !isFilterOpen"
            @refresh="emit('refresh')"
        >
            <template #filter>
                <TimelineFilterPopover
                    :categories="categories"
                    :filter-options="filterOptions"
                    @update:categories="emit('update:categories', $event)"
                    @close="isFilterOpen = false"
                />
            </template>
        </PageDateTopbar>
    </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageDateTopbar from "@/components/common/PageDateTopbar.vue";
import TimelineFilterPopover from "./TimelineFilterPopover.vue";
import type {
    TimelineCategory,
    TimelineFilterOption,
    TimelinePreset,
} from "@/types/timeline";

interface Props {
    preset?: TimelinePreset;
    startDate?: string;
    endDate?: string;
    categories?: TimelineCategory[];
    filterOptions?: TimelineFilterOption[];
}

withDefaults(defineProps<Props>(), {
    categories: () => [],
    filterOptions: () => [],
});

const emit = defineEmits<{
    (e: "update:preset", value: TimelinePreset): void;
    (e: "update:date-range", startDate: string, endDate: string): void;
    (e: "update:categories", value: TimelineCategory[]): void;
    (e: "refresh"): void;
}>();

const isFilterOpen = ref(false);

const handlePresetChange = (value: string) => {
    emit("update:preset", value as TimelinePreset);
};

const handleDateRangeChange = (startDate: string, endDate: string) => {
    emit("update:date-range", startDate, endDate);
};
</script>

<style scoped lang="scss">
.timelineToolbar {
    width: 100%;
    min-width: 0;
}
</style>
