<template>
    <section class="tagTableWrap dataTable">
        <section class="tagTable">
            <DataTableHead
                class="tagTableHead"
                :columns="columns"
                :sort-by="sortBy"
                :sort-order="sortOrder"
                @sort-change="handleSortChange"
            />

            <div class="tableBody dataTable__body">
                <div
                    v-for="(row, index) in rows"
                    :key="row.id"
                    class="tableItem"
                    :class="{ isExpanded: isExpanded(row.id) }"
                >
                    <article
                        class="tableRow dataTable__row"
                        :class="{
                            'is-alt': index % 2 === 1,
                            isAlt: index % 2 === 1,
                        }"
                        @click="toggleRow(row.id)"
                    >
                        <div class="mobileRow">
                            <span
                                class="mobileAccent"
                                :style="{ background: row.tagColor }"
                            ></span>
                            <div class="mobileMain">
                                <div class="mobileTop">
                                    <span class="mobileName">{{
                                        row.playerName
                                    }}</span>
                                    <span
                                        class="mobileChevron"
                                        :class="{
                                            isExpanded: isExpanded(row.id),
                                        }"
                                        aria-hidden="true"
                                    ></span>
                                </div>
                                <div class="mobileMeta">
                                    <span class="mobileTagName">{{
                                        row.tagName
                                    }}</span>
                                    <span class="mobileDivider"></span>
                                    <span
                                        class="countryPill countryPillCompact"
                                    >
                                        <span class="countryDot"></span>
                                        <span class="countryText">{{
                                            row.country
                                        }}</span>
                                    </span>
                                    <span class="mobileTime">{{
                                        row.modifiedAt
                                    }}</span>
                                </div>
                            </div>
                        </div>

                        <div
                            class="tableCell dataTable__cell colTag desktopOnly"
                        >
                            <div class="tagPill">
                                <span
                                    class="tagDot"
                                    :style="{ background: row.tagColor }"
                                ></span>
                                <span class="tagText">{{ row.tagName }}</span>
                            </div>
                        </div>

                        <div
                            class="tableCell dataTable__cell colName desktopOnly"
                        >
                            {{ row.playerName }}
                        </div>

                        <div
                            class="tableCell dataTable__cell colCountry desktopOnly"
                        >
                            <span class="countryPill">
                                <span class="countryDot"></span>
                                <span class="countryText">{{
                                    row.country
                                }}</span>
                            </span>
                        </div>

                        <div
                            class="tableCell dataTable__cell colTime desktopOnly"
                        >
                            {{ row.modifiedAt }}
                        </div>
                    </article>

                    <PlayerTagEditPanel
                        v-show="isExpanded(row.id)"
                        :note="row.note"
                        :tag-color="row.tagColor"
                        :tag-names="tagNames"
                        @update:note="row.note = $event"
                        @update:tag-color="
                            row.tagColor = $event as PlayerTagRow['tagColor']
                        "
                        @save="handleSave(row)"
                        @delete="handleDelete(row)"
                    />
                </div>
            </div>
        </section>

        <DataTablePagination
            :page="page"
            :page-size="pageSize"
            :total="total"
            @page-change="emit('page-change', $event)"
        />
    </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DataTableHead from "@/components/table/DataTableHead.vue";
import DataTablePagination from "@/components/table/DataTablePagination.vue";
import PlayerTagEditPanel from "./PlayerTagEditPanel.vue";
import type { DataTableColumn } from "@/types/table";
import type {
    PlayerTagRow,
    PlayerTagSortField,
    SortOrder,
    PlayerTagNameItem,
} from "@/types/playerTag";

interface Props {
    rows: PlayerTagRow[];
    loading?: boolean;
    page: number;
    pageSize: number;
    total: number;
    sortBy?: PlayerTagSortField;
    sortOrder?: SortOrder;
    tagNames?: PlayerTagNameItem[];
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    sortBy: "modifiedAt",
    sortOrder: "desc",
    tagNames: () => [],
});

const emit = defineEmits<{
    (e: "save", row: PlayerTagRow): void;
    (e: "delete", row: PlayerTagRow): void;
    (e: "page-change", page: number): void;
    (e: "sort-change", sortBy: PlayerTagSortField, sortOrder: SortOrder): void;
}>();

const columns: Array<DataTableColumn<PlayerTagSortField>> = [
    { key: "tagName", label: "標籤", width: "26%", className: "colTag" },
    { key: "playerName", label: "名稱", width: "26%", className: "colName" },
    { key: "country", label: "國家", width: "24%", className: "colCountry" },
    {
        key: "modifiedAt",
        label: "修改時間",
        width: "24%",
        className: "colTime",
    },
];

const expandedId = ref<string | null>(null);

const handleSortChange = (sortBy: PlayerTagSortField, sortOrder: SortOrder) => {
    emit("sort-change", sortBy, sortOrder);
};

const isExpanded = (id: string) => expandedId.value === id;

const toggleRow = (id: string) => {
    expandedId.value = expandedId.value === id ? null : id;
};

const handleSave = (row: PlayerTagRow) => {
    emit("save", row);
    expandedId.value = null;
};

const handleDelete = (row: PlayerTagRow) => {
    emit("delete", row);
};
</script>

<style scoped lang="scss">
.tagTableWrap {
    @include box(100%, auto);
    @include flex(stretch, flex-start);
    flex-direction: column;
    min-width: 0;
}

.tagTable {
    @include box(100%, auto, static);
    @include flex(stretch, flex-start);
    flex-direction: column;
    flex: 1;
    min-width: 0;
    background: var(--dark-neutral-900);

    @include pad {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
}

:deep(.tagTableHead) {
    @include mobile {
        display: none;
    }

    @include pad {
        min-width: 640px;
    }
}

.tableBody {
    @include box(100%, auto, static);
    border-bottom-left-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
    border: 1px solid var(--dark-neutral-700);
    border-top: none;
    overflow: hidden;
    background: transparent;

    @include mobile {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0;
        border: none;
        background: transparent;
    }

    @include pad {
        min-width: 640px;
    }
}

.tableItem {
    @include mobile {
        border: 1px solid var(--dark-neutral-700);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--dark-neutral-800);
        transition: border-color 0.15s ease;

        &.isExpanded {
            border-color: rgba(169, 96, 248, 0.45);
        }
    }

    &:last-child {
        border-bottom: none;
    }
}

.tableRow {
    @include flex(center, flex-start);
    @include box(100%, 36px);
    cursor: pointer;
    background: var(--dark-neutral-700);

    @include mobile {
        display: block;
        height: auto;
        background: transparent;
    }

    @include pad {
        min-width: 640px;
    }

    .colTime {
        color: var(--text-secondary);
    }
}

.tableRow.isAlt,
.tableRow.is-alt {
    background: var(--dark-neutral-800);

    @include mobile {
        background: transparent;
    }
}

.desktopOnly {
    @include mobile {
        display: none !important;
    }
}

.tableCell {
    @include flex(center, flex-start);
    @include box(auto, 100%, static);
    padding: 0 12px;
    color: var(--text-primary);
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;
    border-right: 1px solid var(--table-divider);

    &:last-child {
        border-right: none;
    }
}

.mobileRow {
    display: none;

    @include mobile {
        @include flex(stretch, flex-start);
        width: 100%;
        padding: 12px 12px 12px 0;
        gap: 0;
    }
}

.mobileAccent {
    @include box(4px, auto, static);
    flex-shrink: 0;
    border-radius: 0 4px 4px 0;
    margin-right: 12px;
}

.mobileMain {
    flex: 1;
    min-width: 0;
    padding-right: 4px;
}

.mobileTop {
    @include flex(center, space-between);
    gap: 8px;
    margin-bottom: 6px;
}

.mobileName {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mobileChevron {
    @include box(20px, 20px, static);
    @include flex;
    flex-shrink: 0;
    border: 0.5px solid var(--border-subtle);
    border-radius: 50%;
    background: var(--surface-overlay);
    transition: transform 0.2s ease;

    &::after {
        content: "";
        width: 6px;
        height: 6px;
        border-right: 1.5px solid var(--text-secondary);
        border-bottom: 1.5px solid var(--text-secondary);
        transform: rotate(45deg) translate(-1px, -1px);
    }

    &.isExpanded {
        transform: rotate(180deg);
    }
}

.mobileMeta {
    @include flex(center, flex-start);
    flex-wrap: wrap;
    gap: 6px;
    min-width: 0;
}

.mobileTagName {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 14px;
}

.mobileDivider {
    @include box(1px, 10px, static);
    background: var(--dark-neutral-700);
}

.mobileTime {
    color: var(--text-secondary);
    font-size: 11px;
    line-height: 14px;
    white-space: nowrap;
}

.colTag {
    width: 26%;
}

.colName {
    width: 26%;
}

.colCountry {
    width: 24%;
}

.colTime {
    width: 24%;
}

.tagPill {
    @include flex(center, flex-start);
    gap: 8px;

    &.tagPillCompact {
        gap: 6px;
        min-width: 0;
    }

    .tagDot {
        @include box(34px, 14px, static);
        border-radius: 999px;
        flex-shrink: 0;

        &.tagDotCompact {
            width: 20px;
            height: 10px;
        }
    }

    .tagText {
        color: var(--text-primary);
        font-size: 12px;
        line-height: 16px;
    }

    &.tagPillCompact .tagText {
        font-size: 11px;
        line-height: 14px;
        color: var(--text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.countryPill {
    @include flex(center, flex-start);
    gap: 6px;
    min-width: 0;

    &.countryPillCompact {
        gap: 4px;
    }

    .countryDot {
        @include box(14px, 14px, static);
        border-radius: 50%;
        background: #e63757;
        position: relative;
        flex-shrink: 0;
    }

    &.countryPillCompact .countryDot {
        width: 12px;
        height: 12px;
    }

    .countryDot::after {
        content: "✶";
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 8px;
        color: #fff;
        transform: translate(-50%, -50%);
    }

    &.countryPillCompact .countryDot::after {
        font-size: 7px;
    }

    .countryText {
        color: var(--text-primary);
        font-size: 12px;
        line-height: 16px;
    }

    &.countryPillCompact .countryText {
        font-size: 11px;
        line-height: 14px;
        color: var(--text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
