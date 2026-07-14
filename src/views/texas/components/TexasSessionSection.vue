<template>
    <section class="sessionShell">
        <div class="sessionPanel">
            <header class="sessionToolbar">
                <div class="filters">
                    <BaseField
                        :model-value="stakes"
                        type="select"
                        placeholder="全部籌碼"
                        :options="stakesOptions"
                        @update:model-value="emit('update:stakes', $event)"
                        @change="emit('update:stakes', $event)"
                    />
                </div>

                <button
                    type="button"
                    class="exportBtn"
                    :disabled="loading"
                    @click="emit('export')"
                >
                    下載
                </button>
            </header>

            <div
                class="tableWrap dataTable dataTable--grid sessionTable"
                :class="{ isLoading: loading }"
            >
                <div class="dataTable__scroll">
                    <DataTableHead
                        :columns="columns"
                        :sort-by="sortBy"
                        :sort-order="sortOrder"
                        @sort-change="handleSortChange"
                    />

                    <div class="dataTable__body">
                        <div
                            v-for="(row, index) in rows"
                            :key="row.id"
                            class="dataTable__row"
                            :class="{ 'is-alt': index % 2 === 1 }"
                        >
                            <div class="dataTable__cell colTime">
                                {{ formatTexasDateTime(row.startedAt) }}
                            </div>
                            <div class="dataTable__cell colStakes">
                                {{ row.stakes }}
                            </div>
                            <div class="dataTable__cell colTable">
                                {{ row.tableName }}
                            </div>
                            <div class="dataTable__cell colHands">
                                {{ row.handCount }}
                            </div>
                            <div class="dataTable__cell colDuration">
                                {{ row.duration }}
                            </div>
                            <div
                                class="dataTable__cell colProfit"
                                :class="profitClass(row.profit)"
                            >
                                {{ formatTexasProfit(row.profit) }}
                            </div>
                        </div>

                        <p
                            v-if="!rows.length && !loading"
                            class="dataTable__empty"
                        >
                            暫無遊戲紀錄
                        </p>
                    </div>
                </div>

                <DataTablePagination
                    :page="page"
                    :page-size="pageSize"
                    :total="total"
                    @page-change="emit('page-change', $event)"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import BaseField from "@/components/form/BaseField.vue";
import DataTableHead from "@/components/table/DataTableHead.vue";
import DataTablePagination from "@/components/table/DataTablePagination.vue";
import {
    formatTexasDateTime,
    formatTexasProfit,
} from "@/composables/useTexasFormat";
import type { DataTableColumn, SortOrder } from "@/types/table";
import type { TexasSessionRow, TexasSessionSortField } from "@/types/texas";

interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    rows?: TexasSessionRow[];
    loading?: boolean;
    stakes?: string;
    stakesOptions?: SelectOption[];
    sortBy?: TexasSessionSortField;
    sortOrder?: SortOrder;
    page?: number;
    pageSize?: number;
    total?: number;
}

withDefaults(defineProps<Props>(), {
    rows: () => [],
    loading: false,
    stakes: "",
    stakesOptions: () => [],
    sortBy: "startedAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 10,
    total: 0,
});

const emit = defineEmits<{
    (e: "update:stakes", value: string): void;
    (e: "page-change", page: number): void;
    (e: "export"): void;
    (
        e: "sort-change",
        sortBy: TexasSessionSortField,
        sortOrder: SortOrder,
    ): void;
}>();

const columns: Array<DataTableColumn<TexasSessionSortField>> = [
    { key: "startedAt", label: "開始時間", className: "colTime" },
    { key: "stakes", label: "籌碼", className: "colStakes" },
    { key: "tableName", label: "牌桌", className: "colTable" },
    { key: "handCount", label: "手牌數", className: "colHands" },
    { key: "duration", label: "時長", className: "colDuration" },
    { key: "profit", label: "盈虧", className: "colProfit" },
];

const handleSortChange = (
    nextBy: TexasSessionSortField,
    nextOrder: SortOrder,
) => {
    emit("sort-change", nextBy, nextOrder);
};

const profitClass = (value: number) => {
    if (value > 0) return "isProfit";
    if (value < 0) return "isLoss";
    return "";
};
</script>

<style scoped lang="scss">
.sessionShell {
    width: 100%;
    min-width: 0;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-900);
    box-sizing: border-box;

    @include mobile {
        padding: 8px;
    }
}

.sessionPanel {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-800);
    box-sizing: border-box;
}

.sessionToolbar {
    @include flex(center, space-between);
    gap: 12px;
    min-width: 0;

    @include mobile {
        flex-direction: column;
        align-items: stretch;
    }

    .filters {
        display: grid;
        grid-template-columns: minmax(180px, 240px);
        gap: 12px;
        min-width: 0;

        @include mobile {
            grid-template-columns: 1fr;
        }
    }

    .exportBtn {
        @include flex;
        @include box(133px, var(--control-height));
        @include overlay-btn;
        @include text-body-bold;
        flex-shrink: 0;

        @include mobile {
            width: 100%;
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
}

.tableWrap {
    min-width: 0;
    border-radius: 8px;
    overflow: hidden;

    &.isLoading {
        opacity: 0.7;
    }
}

.colProfit {
    &.isProfit {
        color: var(--chart-green);
    }

    &.isLoss {
        color: var(--chart-red);
    }
}
</style>
