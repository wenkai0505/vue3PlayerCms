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
                <img
                    class="copyFieldIcon"
                    :src="copyIcon"
                    alt=""
                    aria-hidden="true"
                />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import copyIcon from "@/assets/copy.svg";
import { copyToClipboard } from "@/utils/copyToClipboard";

interface Props {
    label: string;
    value: string;
}

const props = defineProps<Props>();

const handleCopy = () => {
    copyToClipboard(props.value);
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
    cursor: pointer;
}

.copyFieldIcon {
    width: 15px;
    height: 18px;
    display: block;
}
</style>
