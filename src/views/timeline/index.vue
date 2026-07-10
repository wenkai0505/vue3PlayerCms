<template>
    <div class="timelinePage">
        <TimelineToolbar
            :preset="query.preset"
            :start-date="query.startDate"
            :end-date="query.endDate"
            :categories="query.categories"
            :filter-options="filterOptions"
            @update:preset="handlePresetChange"
            @update:date-range="handleDateRangeChange"
            @update:categories="handleCategoriesChange"
            @refresh="handleRefresh"
        />
        <TimelineList
            :events="events"
            :loading="loading"
            :expanded-ids="expandedIds"
            @toggle="handleToggle"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import TimelineToolbar from "./components/TimelineToolbar.vue";
import TimelineList from "./components/TimelineList.vue";
import {
    getTimelineFilterOptionsApi,
    getTimelineListApi,
} from "@/apis/timeline";
import type {
    TimelineCategory,
    TimelineEvent,
    TimelineFilterOption,
    TimelineListQuery,
    TimelinePreset,
} from "@/types/timeline";

const DEFAULT_PLAYER_ID = "p100";

const loading = ref(false);
const events = ref<TimelineEvent[]>([]);
const filterOptions = ref<TimelineFilterOption[]>([]);
const expandedIds = ref<Set<string>>(new Set());

const query = ref<TimelineListQuery>({
    playerId: DEFAULT_PLAYER_ID,
    preset: "month",
    categories: [],
    page: 1,
    pageSize: 20,
});

const fetchFilterOptions = async () => {
    try {
        const res = await getTimelineFilterOptionsApi();
        filterOptions.value = res.list;
    } catch (error) {
        console.error(error);
        filterOptions.value = [];
    }
};

const fetchTimeline = async () => {
    loading.value = true;

    try {
        const res = await getTimelineListApi(query.value);
        events.value = res.list;
    } catch (error) {
        console.error(error);
        events.value = [];
    } finally {
        loading.value = false;
    }
};

const handlePresetChange = (preset: TimelinePreset) => {
    query.value.preset = preset;
    query.value.startDate = undefined;
    query.value.endDate = undefined;
    query.value.page = 1;
    fetchTimeline();
};

const handleDateRangeChange = (startDate: string, endDate: string) => {
    query.value.preset = undefined;
    query.value.startDate = startDate;
    query.value.endDate = endDate;
    query.value.page = 1;
    fetchTimeline();
};

const handleCategoriesChange = (categories: TimelineCategory[]) => {
    query.value.categories = categories;
    query.value.page = 1;
    fetchTimeline();
};

const handleToggle = (id: string) => {
    const next = new Set(expandedIds.value);

    if (next.has(id)) {
        next.delete(id);
    } else {
        next.add(id);
    }

    expandedIds.value = next;
};

const handleRefresh = () => {
    // 回到初始狀態：本月、無自訂日期、無分類篩選
    query.value.preset = "month";
    query.value.startDate = undefined;
    query.value.endDate = undefined;
    query.value.categories = [];
    query.value.page = 1;
    expandedIds.value = new Set();
    fetchTimeline();
};

onMounted(async () => {
    await Promise.all([fetchFilterOptions(), fetchTimeline()]);
});
</script>

<style scoped lang="scss">
.timelinePage {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    width: 100%;
    min-width: 0;
    padding-bottom: 40px;

    @include mobile {
        gap: var(--space-xs);
    }
}
</style>
