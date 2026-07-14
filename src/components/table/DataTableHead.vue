<template>
    <header class="dataTable__head" :class="headClass">
        <div
            v-for="column in columns"
            :key="column.key"
            class="dataTable__cell"
            :class="[
                column.className,
                { 'is-sortable': column.sortable !== false },
            ]"
            :style="
                column.width
                    ? { width: column.width, flex: `0 0 ${column.width}` }
                    : undefined
            "
        >
            <span class="dataTable__headLabel">{{ column.label }}</span>
            <button
                v-if="column.sortable !== false"
                type="button"
                class="dataTable__sortBtn"
                :class="{
                    'is-active': sortBy === column.key,
                    [`is-${sortOrder}`]: sortBy === column.key,
                }"
                :aria-label="`排序 ${column.label}`"
                @click.stop="handleSort(column.key)"
            >
                <span class="dataTable__sortUp" aria-hidden="true"></span>
                <span class="dataTable__sortDown" aria-hidden="true"></span>
            </button>
        </div>
    </header>
</template>

<script setup lang="ts" generic="T extends string">
import { getNextSortState } from "@/composables/useTableSort";
import type { DataTableColumn, SortOrder } from "@/types/table";

interface Props {
    columns: Array<DataTableColumn<T>>;
    sortBy?: T;
    sortOrder?: SortOrder;
    headClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    sortOrder: "desc",
    headClass: "",
});

const emit = defineEmits<{
    (e: "sort-change", sortBy: T, sortOrder: SortOrder): void;
}>();

const handleSort = (key: T) => {
    const next = getNextSortState(props.sortBy, props.sortOrder, key);
    emit("sort-change", next.sortBy, next.sortOrder);
};
</script>
