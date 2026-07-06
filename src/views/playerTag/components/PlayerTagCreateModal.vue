<template>
    <el-dialog
        v-model="visible"
        class="tagCreateDialog"
        modal-class="tagCreateOverlay"
        width="482px"
        :show-close="false"
        align-center
        destroy-on-close
        @close="emit('close')"
    >
        <template #header>
            <div class="tagCreateHeader">
                <h3 class="tagCreateTitle">新增玩家標記</h3>
                <button
                    type="button"
                    class="tagCreateClose"
                    aria-label="關閉"
                    @click="handleClose"
                >
                    ×
                </button>
            </div>
        </template>

        <div class="tagCreateBody">
            <div class="tagCreateField tagCreateFieldSearch">
                <span class="tagCreateFieldIcon" aria-hidden="true">
                    <img :src="searchIcon" alt="" />
                </span>
                <input
                    v-model="form.keyword"
                    class="tagCreateInput"
                    type="text"
                    placeholder="搜尋遊戲、玩家..."
                />
            </div>

            <div class="tagCreateField">
                <input
                    v-model="form.content"
                    class="tagCreateInput"
                    type="text"
                    placeholder="請輸入內容"
                />
            </div>

            <div class="tagCreateNoteWrap">
                <textarea
                    v-model="form.note"
                    class="tagCreateNote"
                    placeholder="填寫備註..."
                    rows="6"
                ></textarea>
                <span class="tagCreateNoteIcon">
                    <img :src="editNoteIcon" alt="" aria-hidden="true" />
                </span>
            </div>

            <div class="tagCreateColors">
                <button
                    v-for="color in colorOptions"
                    :key="color"
                    type="button"
                    class="tagCreateColorBtn"
                    :class="{ isActive: form.tagColor === color }"
                    :style="{ background: color }"
                    @click="form.tagColor = color"
                ></button>
            </div>
        </div>

        <template #footer>
            <div class="tagCreateFooter">
                <button
                    type="button"
                    class="tagCreateBtn tagCreateBtnGhost"
                    @click="handleClose"
                >
                    取消
                </button>
                <button
                    type="button"
                    class="tagCreateBtn tagCreateBtnPrimary"
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
import editNoteIcon from "@/assets/editNoteIcon.svg";
import searchIcon from "@/assets/search.svg";
import { playerTagColors } from "@/types/playerTag";
import type { PlayerTagColor } from "@/types/playerTag";

interface Props {
    open?: boolean;
}

interface CreateFormState {
    keyword: string;
    content: string;
    note: string;
    tagColor: PlayerTagColor;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
});

const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "close"): void;
    (e: "save", payload: CreateFormState): void;
}>();

const colorOptions = [...playerTagColors];

const createDefaultForm = (): CreateFormState => ({
    keyword: "",
    content: "",
    note: "",
    tagColor: "#FF8B00",
});

const form = ref<CreateFormState>(createDefaultForm());

const visible = computed({
    get: () => props.open,
    set: (value: boolean) => emit("update:open", value),
});

const resetForm = () => {
    form.value = createDefaultForm();
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            resetForm();
        }
    },
);

const handleClose = () => {
    visible.value = false;
    emit("close");
};

const handleSave = () => {
    emit("save", { ...form.value });
};
</script>

<style scoped lang="scss">
.tagCreateHeader {
    @include flex(center, space-between);
    @include box(100%, auto);

    .tagCreateTitle {
        margin: 0;
        color: var(--text-primary);
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
    }

    .tagCreateClose {
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

.tagCreateBody {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.tagCreateField {
    @include flex(center, flex-start);
    @include box(100%, 40px);
    padding: 0 16px;
    border: 1px solid var(--dark-neutral-700);
    border-radius: 20px;
    background: var(--dark-neutral-900);

    &.tagCreateFieldSearch {
        gap: 6px;
    }
}

.tagCreateFieldIcon {
    @include flex;
    flex-shrink: 0;
    img {
        @include box(16px, 16px, static);
        object-fit: contain;
    }
}

.tagCreateInput {
    @include box(100%, 100%, static);
    border: none;
    outline: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 700;
    line-height: 16px;

    &::placeholder {
        color: var(--gray-500);
        font-weight: 400;
    }
}

.tagCreateNoteWrap {
    position: relative;
    width: 100%;
}

.tagCreateNote {
    @include box(100%, 192px, static);
    padding: 12px 56px 12px 12px;
    border: 1px solid var(--dark-neutral-700);
    border-radius: var(--radius-md);
    background: var(--dark-neutral-900);
    color: var(--text-primary);
    font-size: 12px;
    line-height: 1.3;
    letter-spacing: 0.6px;
    resize: none;
    outline: none;

    &::placeholder {
        color: var(--gray-500);
    }

    @include mobile {
        height: 160px;
        padding-right: 48px;
    }
}

.tagCreateNoteIcon {
    @include box(40px, 40px, absolute);
    @include flex;
    right: 12px;
    bottom: 12px;
    border: 0.5px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--surface-overlay);
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

    img {
        @include box(24px, 24px, static);
        object-fit: contain;
    }
}

.tagCreateColors {
    @include flex(center, flex-start);
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 4px;

    @include mobile {
        justify-content: center;
    }
}

.tagCreateColorBtn {
    @include box(54px, 24px, static);
    border: 2px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s ease;

    &.isActive {
        border-color: var(--text-primary);
    }
}

.tagCreateFooter {
    @include flex(center, stretch);
    gap: 8px;
    width: 100%;

    .tagCreateBtn {
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
    }

    .tagCreateBtnGhost {
        border: 0.5px solid var(--border-subtle);
        background: var(--surface-overlay);
        color: var(--text-primary);
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .tagCreateBtnPrimary {
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
.el-overlay.tagCreateOverlay {
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

.el-dialog.tagCreateDialog {
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
