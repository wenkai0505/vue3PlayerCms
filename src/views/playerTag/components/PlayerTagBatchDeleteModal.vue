<template>
    <el-dialog
        v-model="visible"
        class="tagDeleteDialog"
        modal-class="tagDeleteOverlay"
        width="326px"
        :show-close="false"
        align-center
        destroy-on-close
        @close="emit('close')"
    >
        <template #header>
            <div class="tagDeleteHeader">
                <h3 class="tagDeleteTitle">刪除標籤</h3>
                <button
                    type="button"
                    class="tagDeleteClose"
                    aria-label="關閉"
                    @click="handleClose"
                >
                    ×
                </button>
            </div>
        </template>

        <div v-if="loading" class="tagDeleteLoading">載入中...</div>

        <div v-else class="tagDeleteBody">
            <button
                v-for="item in tagItems"
                :key="item.id"
                type="button"
                class="tagDeleteItem"
                :class="{ isSelected: isSelected(item.id) }"
                :style="{ background: item.tagColor }"
                :aria-label="item.tagName"
                @click="toggleSelect(item.id)"
            ></button>
        </div>

        <template #footer>
            <div class="tagDeleteFooter">
                <button
                    type="button"
                    class="tagDeleteBtn tagDeleteBtnGhost"
                    :disabled="loading"
                    @click="handleClose"
                >
                    取消
                </button>
                <button
                    type="button"
                    class="tagDeleteBtn tagDeleteBtnPrimary"
                    :disabled="loading || selectedIds.length === 0"
                    @click="handleSave"
                >
                    保存
                </button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getPlayerTagNamesApi } from "@/apis/playerTag";
import type { PlayerTagNameItem } from "@/types/playerTag";

interface Props {
    open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
});

const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "close"): void;
    (e: "save", ids: string[]): void;
}>();

const visible = computed({
    get: () => props.open,
    set: (value: boolean) => emit("update:open", value),
});

const tagItems = ref<PlayerTagNameItem[]>([]);
const selectedIds = ref<string[]>([]);
const loading = ref(false);

const fetchTagNames = async () => {
    loading.value = true;
    try {
        const res = await getPlayerTagNamesApi();
        tagItems.value = res.list;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const resetSelection = () => {
    selectedIds.value = [];
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            resetSelection();
            fetchTagNames();
        }
    },
);

const isSelected = (id: string) => selectedIds.value.includes(id);

const toggleSelect = (id: string) => {
    if (isSelected(id)) {
        selectedIds.value = selectedIds.value.filter((itemId) => itemId !== id);
        return;
    }

    selectedIds.value = [...selectedIds.value, id];
};

const handleClose = () => {
    visible.value = false;
    emit("close");
};

const handleSave = () => {
    emit("save", [...selectedIds.value]);
};
</script>

<style scoped lang="scss">
.tagDeleteHeader {
    @include flex(center, space-between);
    @include box(100%, auto);

    .tagDeleteTitle {
        margin: 0;
        color: var(--text-primary);
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
    }

    .tagDeleteClose {
        @include flex;
        @include box(24px, 24px);
        border: none;
        background: transparent;
        color: var(--text-primary);
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
    }
}

.tagDeleteLoading {
    @include flex;
    min-height: 96px;
    color: var(--text-secondary);
    font-size: 13px;
}

.tagDeleteBody {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @include mobile {
        gap: 8px;
    }
}

.tagDeleteItem {
    @include box(100%, 40px, static);
    border: 2px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    transition: border-color 0.15s ease;

    &.isSelected {
        border-color: var(--text-primary);
    }
}

.tagDeleteFooter {
    @include flex(center, stretch);
    gap: 8px;
    width: 100%;

    .tagDeleteBtn {
        @include flex;
        @include box(auto, 40px);
        flex: 1;
        padding: 0 20px;
        border-radius: var(--radius-lg);
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
        white-space: nowrap;
        cursor: pointer;

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

    .tagDeleteBtnGhost {
        border: 0.5px solid var(--border-subtle);
        background: var(--surface-overlay);
        color: var(--text-primary);
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .tagDeleteBtnPrimary {
        border: none;
        color: var(--text-primary);
        background: linear-gradient(
            149.53deg,
            var(--color-primary-grad-from) 0%,
            var(--color-primary-grad-to) 100%
        );
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
}
</style>

<style lang="scss">
.el-overlay.tagDeleteOverlay {
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;

    .el-overlay-dialog {
        @include flex;
        width: 100%;
        max-width: 100%;
        height: auto;
        max-height: 100%;
        padding: 16px;
        box-sizing: border-box;
        pointer-events: none;
    }
}

.el-dialog.tagDeleteDialog {
    --el-dialog-bg-color: #1a2033;
    --el-dialog-box-shadow: none;
    --el-dialog-padding-primary: 12px;
    --el-text-color-primary: #ffffff;
    --el-dialog-margin-top: 0;
    width: 326px !important;
    padding: 12px;
    border: 1px solid #242b42;
    border-radius: 12px;
    background-color: #1a2033 !important;
    max-width: calc(100vw - 32px);
    height: auto !important;
    max-height: calc(100vh - 32px);
    margin: 0 auto !important;
    display: flex;
    flex-direction: column;
    pointer-events: auto;

    @include mobile {
        width: min(326px, calc(100vw - 32px)) !important;
        padding: 10px;
    }

    @include pad {
        width: min(326px, calc(100vw - 48px)) !important;
    }

    .el-dialog__header {
        padding: 0;
        margin: 0 0 12px;
        margin-right: 0;
        flex-shrink: 0;
    }

    .el-dialog__body {
        padding: 0;
        color: #ffffff;
        flex: 0 1 auto;
        height: auto;
        overflow-y: auto;
    }

    .el-dialog__footer {
        padding: 0;
        margin-top: 12px;
        flex-shrink: 0;
    }
}
</style>
