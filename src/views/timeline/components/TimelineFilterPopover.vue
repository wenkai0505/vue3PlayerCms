<template>
    <div class="filterPanel">
        <div class="filterHeader">
            <span>過濾</span>
            <button
                type="button"
                class="filterClose"
                aria-label="關閉"
                @click="emit('close')"
            >
                ×
            </button>
        </div>

        <label
            v-for="option in filterOptions"
            :key="option.value"
            class="filterItem"
        >
            <input
                type="checkbox"
                class="filterCheckbox"
                :checked="categories.includes(option.value)"
                @change="handleToggle(option.value)"
            />
            <span class="filterLabel">{{ option.label }}</span>
        </label>

        <button type="button" class="filterCancel" @click="handleCancel">
            取消
        </button>
    </div>
</template>

<script setup lang="ts">
import type { TimelineCategory, TimelineFilterOption } from "@/types/timeline";

interface Props {
    categories: TimelineCategory[];
    filterOptions: TimelineFilterOption[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: "update:categories", value: TimelineCategory[]): void;
    (e: "close"): void;
}>();

const handleToggle = (value: TimelineCategory) => {
    const next = props.categories.includes(value)
        ? props.categories.filter((item) => item !== value)
        : [...props.categories, value];

    emit("update:categories", next);
};

const handleCancel = () => {
    emit("update:categories", []);
    emit("close");
};
</script>

<style scoped lang="scss">
.filterPanel {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    width: 161px;
    padding: 24px;
    border-radius: var(--radius-md);
    background: var(--dark-neutral-800);

    .filterHeader {
        @include flex(center, space-between);
        width: 100%;
        font-size: 12px;
        letter-spacing: 0.6px;
        color: var(--text-primary);
    }

    .filterClose {
        border: 0;
        background: transparent;
        color: var(--text-primary);
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
    }

    .filterItem {
        @include flex(center, flex-start);
        gap: var(--space-xs);
        cursor: pointer;
    }

    .filterCheckbox {
        @include box(14px, 14px);
        flex-shrink: 0;
        margin: 0;
        border: 1px solid var(--border-strong);
        border-radius: 2px;
        background: transparent;
        cursor: pointer;
        position: relative;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease;

        &:checked {
            border-color: var(--color-primary);
            background: var(--color-primary);

            &::after {
                content: "";
                position: absolute;
                left: 4px;
                top: 1px;
                width: 4px;
                height: 8px;
                border: solid var(--text-primary);
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
        }

        &:focus-visible {
            outline: 2px solid var(--color-primary-focus);
            outline-offset: 2px;
        }
    }

    .filterLabel {
        font-size: var(--font-size-body);
        line-height: 1.3;
        letter-spacing: 1.3px;
        color: var(--text-primary);
    }

    .filterCancel {
        @include flex;
        @include overlay-btn;
        @include text-body-bold;
        width: 100%;
        height: var(--control-height);
    }
}
</style>
