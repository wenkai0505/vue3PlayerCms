<template>
    <el-dialog
        v-model="visible"
        class="tagNameDialog"
        modal-class="tagNameOverlay"
        width="482px"
        :show-close="false"
        align-center
        destroy-on-close
        @close="emit('close')"
    >
        <template #header>
            <div class="tagNameHeader">
                <h3 class="tagNameTitle">標籤名稱</h3>
                <button
                    type="button"
                    class="tagNameClose"
                    aria-label="關閉"
                    @click="handleClose"
                >
                    ×
                </button>
            </div>
        </template>

        <div v-if="loading" class="tagNameLoading">載入中...</div>

        <div v-else class="tagNameBody">
            <div v-for="item in tagItems" :key="item.id" class="tagNameItem">
                <span
                    class="tagNameColor"
                    :style="{ background: item.tagColor }"
                ></span>
                <input
                    v-model="item.tagName"
                    class="tagNameInput"
                    type="text"
                    placeholder="請輸入內容"
                />
            </div>
        </div>

        <template #footer>
            <div class="tagNameFooter">
                <button
                    type="button"
                    class="tagNameBtn tagNameBtnGhost"
                    :disabled="loading || saving"
                    @click="handleClose"
                >
                    取消
                </button>
                <button
                    type="button"
                    class="tagNameBtn tagNameBtnPrimary"
                    :disabled="loading || saving"
                    @click="handleSave"
                >
                    {{ saving ? "保存中..." : "保存" }}
                </button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
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
    (e: "save", items: PlayerTagNameItem[]): void;
}>();

const visible = computed({
    get: () => props.open,
    set: (value: boolean) => emit("update:open", value),
});

const tagItems = ref<PlayerTagNameItem[]>([]);
const loading = ref(false);
const saving = ref(false);

const fetchTagNames = async () => {
    loading.value = true;
    try {
        const res = await getPlayerTagNamesApi();
        tagItems.value = res.list.map((item) => ({ ...item }));
    } catch (error) {
        console.error(error);

        //@ts-ignore
        ElMessage({
            message: "標籤名稱載入失敗",
            type: "error",
        });
    } finally {
        loading.value = false;
    }
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            fetchTagNames();
        }
    },
);

const handleClose = () => {
    visible.value = false;
    emit("close");
};

const handleSave = () => {
    const hasEmpty = tagItems.value.some((item) => !item.tagName.trim());
    if (hasEmpty) {
        //@ts-ignore
        ElMessage({
            message: "標籤名稱不可為空",
            type: "warning",
        });
        return;
    }

    saving.value = true;
    try {
        emit("save", tagItems.value);
    } finally {
        saving.value = false;
    }
};
</script>

<style scoped lang="scss">
.tagNameHeader {
    @include flex(center, space-between);
    @include box(100%, auto);

    .tagNameTitle {
        margin: 0;
        color: var(--text-primary);
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
    }

    .tagNameClose {
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

.tagNameLoading {
    @include flex;
    min-height: 120px;
    color: var(--text-secondary);
    font-size: 13px;
}

.tagNameBody {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @include mobile {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    @include pad {
        gap: 10px;
    }

    .tagNameItem {
        @include flex(center, flex-start);
        gap: 12px;
        min-width: 0;

        .tagNameColor {
            @include box(54px, 24px, static);
            flex-shrink: 0;
            border-radius: 999px;
        }

        .tagNameInput {
            @include box(100%, 40px, static);
            flex: 1;
            min-width: 0;
            padding: 0 16px;
            border: 1px solid var(--dark-neutral-700);
            border-radius: 20px;
            background: var(--dark-neutral-900);
            color: var(--text-primary);
            font-size: 13px;
            font-weight: 700;
            line-height: 16px;
            outline: none;

            &::placeholder {
                color: var(--text-placeholder);
                font-weight: 400;
            }
        }
    }
}

.tagNameFooter {
    @include flex(center, stretch);
    gap: 8px;
    width: 100%;

    .tagNameBtn {
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

        &.tagNameBtnGhost {
            border: 0.5px solid var(--border-subtle);
            background: var(--surface-overlay);
            color: var(--text-primary);
            box-shadow:
                0 2px 8px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        &.tagNameBtnPrimary {
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
}
</style>

<style lang="scss">
.el-overlay.tagNameOverlay {
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

.el-dialog.tagNameDialog {
    --el-dialog-bg-color: #1a2033;
    --el-dialog-box-shadow: none;
    --el-dialog-padding-primary: 12px;
    --el-text-color-primary: #ffffff;
    --el-dialog-margin-top: 0;
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
        width: min(482px, calc(100vw - 32px)) !important;
        padding: 10px;
    }

    @include pad {
        width: min(482px, calc(100vw - 48px)) !important;
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
