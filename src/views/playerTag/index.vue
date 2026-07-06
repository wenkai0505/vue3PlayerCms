<template>
    <div class="tagPage">
        <section class="tagSurface">
            <PlayerTagToolbar
                :keyword="query.keyword"
                :tag-name="query.tagName"
                :country="query.country"
                :tag-options="tagOptions"
                :country-options="countryOptions"
                @update:keyword="query.keyword = $event"
                @update:tag-name="query.tagName = $event"
                @update:country="query.country = $event"
                @search="handleSearch"
                @filter="handleFilter"
                @save-tag-names="handleSaveTagNames"
            />
            <div class="tagContent">
                <PlayerTagTable
                    :rows="rows"
                    :loading="loading"
                    :page="query.page"
                    :page-size="query.pageSize"
                    :total="total"
                    @save="handleSave"
                    @delete="handleDelete"
                    @page-change="handlePageChange"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import PlayerTagToolbar from "./components/PlayerTagToolbar.vue";
import PlayerTagTable from "./components/PlayerTagTable.vue";
import {
    getPlayerTagListApi,
    getPlayerTagFilterOptionsApi,
    getPlayerTagCountryOptionsApi,
    updatePlayerTagNamesApi,
} from "@/apis/playerTag";
import type {
    PlayerTagRow,
    PlayerTagListQuery,
    PlayerTagNameItem,
} from "@/types/playerTag";

const rows = ref<PlayerTagRow[]>([]);
const loading = ref(false);
const tagOptions = ref<string[]>([]);
const countryOptions = ref<string[]>([]);

const query = ref<PlayerTagListQuery>({
    keyword: "",
    tagName: "",
    country: "",
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

const fetchTagOptions = async () => {
    try {
        const res = await getPlayerTagFilterOptionsApi();
        tagOptions.value = res.list;
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

const handleSaveTagNames = async (items: PlayerTagNameItem[]) => {
    try {
        await updatePlayerTagNamesApi({
            list: items.map((item) => ({
                id: item.id,
                tagName: item.tagName.trim(),
            })),
        });

        ElMessage.success("標籤名稱已更新");
        await fetchTagOptions();
        fetchList();
    } catch (error) {
        console.error(error);
        ElMessage.error("標籤名稱更新失敗");
    }
};

const handleSave = (row: PlayerTagRow) => {
    console.log("save", row);
};

const handleDelete = (row: PlayerTagRow) => {
    console.log("delete", row);
};

const handlePageChange = (page: number) => {
    query.value.page = page;
    fetchList();
};

onMounted(() => {
    fetchTagOptions();
    fetchCountryOptions();
    fetchList();
});
</script>

<style scoped lang="scss">
.tagPage {
    @include box(100%, auto);
    min-height: 100%;
    min-width: 0;
    background: var(--dark-neutral-800);

    .tagSurface {
        @include box(100%, 100%);
        @include flex(stretch, flex-start);
        flex-direction: column;
        gap: 12px;
        background: var(--dark-neutral-900);
        border-radius: var(--radius-md);
        padding: 12px;
        min-width: 0;

        @include mobile {
            gap: 8px;
            padding: 8px;
            border-radius: 0;
        }

        @include pad {
            padding: 10px;
        }
    }

    .tagContent {
        @include box(100%, auto);
        flex: 1;
        min-width: 0;
    }
}
</style>
