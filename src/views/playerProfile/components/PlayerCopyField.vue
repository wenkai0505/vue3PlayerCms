<template>
    <div class="copyField">
        <p class="copyFieldLabel">{{ label }}</p>
        <div class="copyFieldBox">
            <span class="copyFieldValue">{{ value }}</span>
            <button
                type="button"
                class="copyFieldBtn"
                aria-label="複製"
                @click="handleCopy"
            >
                <svg viewBox="0 0 15 18" aria-hidden="true">
                    <path
                        d="M4 0h8a2 2 0 0 1 2 2v10h-2V2H4V0Zm-2 4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2h-2v2H2V6h2Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

interface Props {
    label: string;
    value: string;
}

const props = defineProps<Props>();

const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(props.value);
        ElMessage.success("已複製");
    } catch {
        ElMessage.error("複製失敗");
    }
};
</script>

<style scoped lang="scss">
.copyField {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 12px;
    width: 100%;
}

.copyFieldLabel {
    color: var(--text-primary);
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0.2px;
}

.copyFieldBox {
    @include flex(center, space-between);
    width: 100%;
    min-height: 42px;
    padding: 5px 13px;
    border: 1px solid var(--dark-neutral-700);
    border-radius: 8px;
    gap: 12px;
}

.copyFieldValue {
    flex: 1;
    min-width: 0;
    color: var(--text-primary);
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0.2px;
    word-break: break-word;
}

.copyFieldBtn {
    @include flex;
    @include box(32px, 32px);
    flex-shrink: 0;
    border: 0;
    border-radius: 50%;
    background: #34384a;
    color: var(--text-secondary);
    cursor: pointer;

    svg {
        width: 15px;
        height: 18px;
    }
}
</style>
