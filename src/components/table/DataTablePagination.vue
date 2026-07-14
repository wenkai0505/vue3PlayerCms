<template>
    <footer class="dataTable__pager">
        <div class="dataTable__pagerMain">
            <button
                type="button"
                class="dataTable__pagerIcon"
                :disabled="page <= 1"
                aria-label="第一頁"
                @click="handlePageChange(1)"
            >
                «
            </button>
            <button
                type="button"
                class="dataTable__pagerIcon"
                :disabled="page <= 1"
                aria-label="上一頁"
                @click="handlePageChange(page - 1)"
            >
                ‹
            </button>

            <template
                v-for="(item, index) in pageItems"
                :key="`${item}-${index}`"
            >
                <span
                    v-if="item === 'ellipsis'"
                    class="dataTable__pagerEllipsis"
                    >...</span
                >
                <button
                    v-else
                    type="button"
                    class="dataTable__pagerNum"
                    :class="{ 'is-active': item === page }"
                    @click="handlePageChange(item)"
                >
                    {{ item }}
                </button>
            </template>

            <button
                type="button"
                class="dataTable__pagerIcon"
                :disabled="page >= totalPages"
                aria-label="下一頁"
                @click="handlePageChange(page + 1)"
            >
                ›
            </button>
            <button
                type="button"
                class="dataTable__pagerIcon"
                :disabled="page >= totalPages"
                aria-label="最後一頁"
                @click="handlePageChange(totalPages)"
            >
                »
            </button>
        </div>

        <div v-if="showJump" class="dataTable__pagerJump">
            <span class="dataTable__pagerJumpLabel">前往頁數</span>
            <input
                v-model="jumpPage"
                class="dataTable__pagerJumpInput"
                type="number"
                min="1"
                :max="totalPages"
                @keyup.enter="handleJumpPage"
            />
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { useTablePagination } from "@/composables/useTablePagination";

interface Props {
    page: number;
    pageSize: number;
    total: number;
    showJump?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showJump: true,
});

const emit = defineEmits<{
    (e: "page-change", page: number): void;
}>();

const { page, pageSize, total, showJump } = toRefs(props);
const jumpPage = ref(String(props.page));

const { totalPages, pageItems } = useTablePagination(page, pageSize, total);

watch(page, (value) => {
    jumpPage.value = String(value);
});

const handlePageChange = (next: number) => {
    if (next < 1 || next > totalPages.value || next === page.value) return;
    emit("page-change", next);
};

const handleJumpPage = () => {
    const target = Number(jumpPage.value);
    if (!target || Number.isNaN(target)) return;
    handlePageChange(target);
};
</script>
