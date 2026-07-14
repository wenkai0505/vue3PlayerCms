<template>
    <div class="texasPage">
        <TexasToolbar
            :preset="baseQuery.preset"
            :start-date="baseQuery.startDate"
            :end-date="baseQuery.endDate"
            :disabled="loading"
            @update:preset="handlePresetChange"
            @update:date-range="handleDateRangeChange"
            @refresh="handleRefresh"
        />

        <TexasSummaryRow :summary="summary" :loading="summaryLoading" />

        <TexasStreetStatsRow :blocks="streetBlocks" :loading="streetLoading" />

        <TexasHandsHighlightRow
            :best="handsHighlight.best"
            :worst="handsHighlight.worst"
            :loading="highlightLoading"
        />

        <TexasSessionSection
            :rows="sessions"
            :loading="sessionLoading"
            :stakes="sessionQuery.stakes"
            :stakes-options="stakesOptions"
            :sort-by="sessionQuery.sortBy"
            :sort-order="sessionQuery.sortOrder"
            :page="sessionQuery.page"
            :page-size="sessionQuery.pageSize"
            :total="sessionTotal"
            @update:stakes="handleStakesChange"
            @sort-change="handleSessionSortChange"
            @page-change="handleSessionPageChange"
            @export="handleExportSessions"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import TexasToolbar from "./components/TexasToolbar.vue";
import TexasSummaryRow from "./components/TexasSummaryRow.vue";
import TexasStreetStatsRow from "./components/TexasStreetStatsRow.vue";
import TexasHandsHighlightRow from "./components/TexasHandsHighlightRow.vue";
import TexasSessionSection from "./components/TexasSessionSection.vue";
import {
    exportTexasSessionsApi,
    getTexasHandsHighlightApi,
    getTexasSessionListApi,
    getTexasStreetStatsApi,
    getTexasSummaryApi,
} from "@/apis/texas";
import type { SortOrder } from "@/types/table";
import type {
    TexasBaseQuery,
    TexasHandsHighlightResponse,
    TexasPreset,
    TexasSessionListQuery,
    TexasSessionRow,
    TexasSessionSortField,
    TexasStreetBlock,
    TexasSummaryResponse,
} from "@/types/texas";

const DEFAULT_PLAYER_ID = "p100";

const loading = ref(false);
const summaryLoading = ref(false);
const streetLoading = ref(false);
const highlightLoading = ref(false);
const sessionLoading = ref(false);

const summary = ref<TexasSummaryResponse | null>(null);
const streetBlocks = ref<TexasStreetBlock[]>([]);
const handsHighlight = ref<TexasHandsHighlightResponse>({
    best: [],
    worst: [],
});
const sessions = ref<TexasSessionRow[]>([]);
const sessionTotal = ref(0);

const baseQuery = reactive<TexasBaseQuery>({
    playerId: DEFAULT_PLAYER_ID,
    preset: "month",
});

const sessionQuery = reactive<
    Pick<
        TexasSessionListQuery,
        "stakes" | "sortBy" | "sortOrder" | "page" | "pageSize"
    >
>({
    stakes: "",
    sortBy: "startedAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 10,
});

const stakesOptions = [
    { label: "全部籌碼", value: "" },
    { label: "$0.01 / $0.02", value: "$0.01 / $0.02" },
    { label: "$0.05 / $0.10", value: "$0.05 / $0.10" },
    { label: "$0.10 / $0.25", value: "$0.10 / $0.25" },
    { label: "$0.25 / $0.50", value: "$0.25 / $0.50" },
];

const buildBaseParams = (): TexasBaseQuery => ({
    playerId: baseQuery.playerId,
    preset: baseQuery.preset,
    startDate: baseQuery.startDate,
    endDate: baseQuery.endDate,
});

const fetchSummary = async () => {
    summaryLoading.value = true;
    try {
        summary.value = await getTexasSummaryApi(buildBaseParams());
    } catch (error) {
        console.error(error);
        summary.value = null;
    } finally {
        summaryLoading.value = false;
    }
};

const fetchStreetStats = async () => {
    streetLoading.value = true;
    try {
        const res = await getTexasStreetStatsApi(buildBaseParams());
        streetBlocks.value = res.list;
    } catch (error) {
        console.error(error);
        streetBlocks.value = [];
    } finally {
        streetLoading.value = false;
    }
};

const fetchHandsHighlight = async () => {
    highlightLoading.value = true;
    try {
        handsHighlight.value =
            await getTexasHandsHighlightApi(buildBaseParams());
    } catch (error) {
        console.error(error);
        handsHighlight.value = { best: [], worst: [] };
    } finally {
        highlightLoading.value = false;
    }
};

const fetchSessions = async () => {
    sessionLoading.value = true;
    try {
        const res = await getTexasSessionListApi({
            ...buildBaseParams(),
            stakes: sessionQuery.stakes || undefined,
            sortBy: sessionQuery.sortBy,
            sortOrder: sessionQuery.sortOrder,
            page: sessionQuery.page,
            pageSize: sessionQuery.pageSize,
        });
        sessions.value = res.list;
        sessionTotal.value = res.total;
    } catch (error) {
        console.error(error);
        sessions.value = [];
        sessionTotal.value = 0;
    } finally {
        sessionLoading.value = false;
    }
};

const fetchDashboard = async () => {
    loading.value = true;
    await Promise.all([
        fetchSummary(),
        fetchStreetStats(),
        fetchHandsHighlight(),
        fetchSessions(),
    ]);
    loading.value = false;
};

const handlePresetChange = (preset: TexasPreset) => {
    baseQuery.preset = preset;
    baseQuery.startDate = undefined;
    baseQuery.endDate = undefined;
    sessionQuery.page = 1;
    fetchDashboard();
};

const handleDateRangeChange = (startDate: string, endDate: string) => {
    baseQuery.preset = undefined;
    baseQuery.startDate = startDate;
    baseQuery.endDate = endDate;
    sessionQuery.page = 1;
    fetchDashboard();
};

const handleRefresh = () => {
    baseQuery.preset = "month";
    baseQuery.startDate = undefined;
    baseQuery.endDate = undefined;
    sessionQuery.stakes = "";
    sessionQuery.sortBy = "startedAt";
    sessionQuery.sortOrder = "desc";
    sessionQuery.page = 1;
    fetchDashboard();
};

const handleStakesChange = (stakes: string) => {
    sessionQuery.stakes = stakes;
    sessionQuery.page = 1;
    fetchSessions();
};

const handleSessionSortChange = (
    sortBy: TexasSessionSortField,
    sortOrder: SortOrder,
) => {
    sessionQuery.sortBy = sortBy;
    sessionQuery.sortOrder = sortOrder;
    sessionQuery.page = 1;
    fetchSessions();
};

const handleSessionPageChange = (page: number) => {
    sessionQuery.page = page;
    fetchSessions();
};

const handleExportSessions = async () => {
    try {
        const res = await exportTexasSessionsApi({
            ...buildBaseParams(),
            stakes: sessionQuery.stakes || undefined,
        });
        if (res.downloadUrl) {
            window.open(res.downloadUrl, "_blank");
        } else {
            ElMessage.warning("尚未取得下載連結");
        }
    } catch (error) {
        console.error(error);
        ElMessage.error("匯出失敗");
    }
};

onMounted(() => {
    fetchDashboard();
});
</script>

<style scoped lang="scss">
.texasPage {
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
