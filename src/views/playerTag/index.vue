<template>
    <PageSurface>
        <PlayerTagToolbar
            :keyword="query.keyword"
            :tag-name="query.tagName"
            :country="query.country"
            :tag-options="tagOptions"
            :tag-names="tagNames"
            :excluded-player-ids="excludedPlayerIds"
            :country-options="countryOptions"
            @update:keyword="query.keyword = $event"
            @update:tag-name="query.tagName = $event"
            @update:country="query.country = $event"
            @search="handleSearch"
            @filter="handleFilter"
            @save-tag-names="handleSaveTagNames"
            @batch-delete="handleBatchDelete"
            @create="handleCreate"
        />
        <div class="tagContent">
            <PlayerTagTable
                :rows="rows"
                :loading="loading"
                :page="query.page"
                :page-size="query.pageSize"
                :total="total"
                :sort-by="query.sortBy"
                :sort-order="query.sortOrder"
                :tag-names="tagNames"
                @save="handleSave"
                @delete="handleDelete"
                @page-change="handlePageChange"
                @sort-change="handleSortChange"
            />
        </div>
    </PageSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import PlayerTagToolbar from "./components/PlayerTagToolbar.vue";
import PlayerTagTable from "./components/PlayerTagTable.vue";
import PageSurface from "@/components/layout/PageSurface.vue";
import {
    getPlayerTagListApi,
    getPlayerTagNamesApi,
    getPlayerTagCountryOptionsApi,
    updatePlayerTagNamesApi,
    batchDeletePlayerTagsApi,
    updatePlayerTagApi,
    createPlayerTagApi,
} from "@/apis/playerTag";
import type {
    CreatePlayerTagPayload,
    PlayerTagRow,
    PlayerTagListQuery,
    PlayerTagNameItem,
    PlayerTagSortField,
    SortOrder,
} from "@/types/playerTag";

const rows = ref<PlayerTagRow[]>([]);
const loading = ref(false);
const tagNames = ref<PlayerTagNameItem[]>([]);
const countryOptions = ref<string[]>([]);

const tagOptions = computed(() => tagNames.value.map((item) => item.tagName));
const excludedPlayerIds = computed(() =>
    rows.value.map((item) => item.playerId),
);

const query = ref<PlayerTagListQuery>({
    keyword: "",
    tagName: "",
    country: "",
    sortBy: "modifiedAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 10,
});

const total = ref(0);

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await getPlayerTagListApi(query.value);
        rows.value = res.list;
        total.value = res.total;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const fetchTagNames = async () => {
    try {
        const res = await getPlayerTagNamesApi();
        tagNames.value = res.list;
    } catch (error) {
        console.error(error);
    }
};

const fetchCountryOptions = async () => {
    try {
        const res = await getPlayerTagCountryOptionsApi();
        countryOptions.value = res.list;
    } catch (error) {
        console.error(error);
    }
};

const handleSearch = () => {
    query.value.page = 1;
    fetchList();
};

const handleFilter = () => {
    query.value.page = 1;
    fetchList();
};

const handleSortChange = (sortBy: PlayerTagSortField, sortOrder: SortOrder) => {
    query.value.sortBy = sortBy;
    query.value.sortOrder = sortOrder;
    query.value.page = 1;
    fetchList();
};

const handleSaveTagNames = async (items: PlayerTagNameItem[]) => {
    try {
        await updatePlayerTagNamesApi({
            list: items.map((item) => ({
                id: item.id,
                tagName: item.tagName.trim(),
            })),
        });

        ElMessage.success("標籤名稱已更新");
        await fetchTagNames();
        fetchList();
    } catch (error) {
        console.error(error);
        ElMessage.error("標籤名稱更新失敗");
    }
};

const handleBatchDelete = async (ids: string[]) => {
    try {
        await batchDeletePlayerTagsApi({ tagIds: ids });
        ElMessage({
            message: "批量刪除成功",
            type: "success",
        });
        query.value.page = 1;
        await fetchList();
        await fetchCountryOptions();
    } catch (error) {
        console.error(error);
        ElMessage({
            message: "批量刪除失敗",
            type: "error",
        });
    }
};

const handleCreate = async (payload: CreatePlayerTagPayload) => {
    try {
        await createPlayerTagApi(payload);
        ElMessage({
            message: "新增玩家標記成功",
            type: "success",
        });
        query.value.page = 1;
        await fetchList();
        await fetchCountryOptions();
    } catch (error) {
        console.error(error);
        const status = (error as any)?.response?.status;
        const message = (error as any)?.response?.data?.message;

        if (status === 409 || message === "Player tag already exists") {
            ElMessage({
                message: "此玩家已在標記列表中，請選擇其他玩家",
                type: "warning",
            });
            return;
        }

        ElMessage({
            message: "新增玩家標記失敗",
            type: "error",
        });
    }
};

const handleSave = async (row: PlayerTagRow) => {
    try {
        const matchedTag = tagNames.value.find(
            (item) => item.tagColor === row.tagColor,
        );

        if (!matchedTag) {
            ElMessage({
                message: "找不到對應標籤，請重新選擇",
                type: "error",
            });
            return;
        }

        await updatePlayerTagApi({
            id: row.id,
            tagId: matchedTag.id,
            note: row.note,
        });

        ElMessage({
            message: "玩家資訊已更新",
            type: "success",
        });
        await fetchList();
    } catch (error) {
        console.error(error);
        ElMessage({
            message: "更新玩家資訊失敗",
            type: "error",
        });
    }
};

const handleDelete = (row: PlayerTagRow) => {
    row.note = "";
};

const handlePageChange = (page: number) => {
    query.value.page = page;
    fetchList();
};

onMounted(() => {
    fetchTagNames();
    fetchCountryOptions();
    fetchList();
});
</script>

<style scoped lang="scss">
.tagContent {
    @include box(100%, auto);
    flex: 1;
    min-width: 0;
}
</style>
