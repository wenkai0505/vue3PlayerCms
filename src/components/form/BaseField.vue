<template>
    <div
        ref="fieldRef"
        class="field"
        :class="[
            fieldTypeClass,
            {
                isReadonly: readonly,
                hasIcon: withIcon,
                isOpen: isDropdownOpen,
            },
        ]"
    >
        <span v-if="withIcon" class="fieldIcon" aria-hidden="true">⌕</span>

        <input
            v-if="type !== 'select'"
            class="fieldInput"
            :type="type === 'search' ? 'text' : type"
            :placeholder="placeholder"
            :value="modelValue"
            :readonly="readonly"
            @input="handleInput"
        />

        <div v-else class="fieldSelectWrap">
            <button
                type="button"
                class="fieldSelectBtn"
                :disabled="readonly"
                @click="toggleDropdown"
            >
                <span class="fieldValue" :class="{ hasValue: !!modelValue }">
                    {{ displayLabel }}
                </span>
                <span class="fieldArrow" aria-hidden="true"></span>
            </button>

            <div v-if="isDropdownOpen" class="fieldDropdown">
                <button
                    v-for="option in options"
                    :key="option.value"
                    type="button"
                    class="fieldOption"
                    :class="{ isActive: option.value === modelValue }"
                    @click="handleSelect(option.value)"
                >
                    {{ option.label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    modelValue?: string;
    placeholder?: string;
    type?: "text" | "search" | "select";
    readonly?: boolean;
    withIcon?: boolean;
    options?: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    placeholder: "",
    type: "text",
    readonly: false,
    withIcon: false,
    options: () => [],
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "change", value: string): void;
}>();

const fieldRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);

const fieldTypeClass = computed(() => {
    const fieldType = props.type ?? "text";
    return `type${fieldType.charAt(0).toUpperCase()}${fieldType.slice(1)}`;
});

const displayLabel = computed(() => {
    if (!props.modelValue) return props.placeholder;

    const matched = props.options.find(
        (option) => option.value === props.modelValue,
    );

    return matched?.label || props.modelValue;
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
};

const toggleDropdown = () => {
    if (props.readonly) return;
    isDropdownOpen.value = !isDropdownOpen.value;
};

const handleSelect = (value: string) => {
    emit("update:modelValue", value);
    emit("change", value);
    isDropdownOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (!fieldRef.value?.contains(target)) {
        isDropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.field {
    @include flex(center, flex-start);
    width: 100%;
    max-width: 240px;
    height: 40px;
    position: relative;
    flex-shrink: 0;

    @include mobile {
        max-width: none;
    }

    @include pad {
        max-width: none;
    }
    padding: 0 16px;
    border: 1px solid var(--dark-neutral-700);
    border-radius: 20px;
    background: var(--dark-neutral-900);
    color: var(--gray-500);
    overflow: visible;

    .fieldIcon {
        margin-right: 6px;
        color: var(--gray-500);
        font-size: 16px;
        line-height: 1;
    }

    .fieldInput {
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
        }
    }

    .fieldSelectWrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .fieldSelectBtn {
        @include flex(center, space-between);
        @include box(100%, 100%, static);
        border: none;
        padding: 0;
        background: transparent;
        color: var(--gray-500);
        cursor: pointer;

        &:disabled {
            cursor: default;
        }
    }

    .fieldValue {
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
        color: var(--gray-500);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.hasValue {
            color: var(--text-primary);
        }
    }

    .fieldArrow {
        @include box(8px, 8px, static);
        flex-shrink: 0;
        margin-left: 8px;
        border-right: 2px solid var(--gray-500);
        border-bottom: 2px solid var(--gray-500);
        transform: rotate(45deg);
        opacity: 0.9;
        transition: transform 0.2s ease;
    }

    &.isOpen .fieldArrow {
        transform: rotate(-135deg);
    }

    .fieldDropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        z-index: 20;
        width: 100%;
        padding: 8px;
        border: 1px solid var(--dark-neutral-700);
        border-radius: var(--radius-md);
        background: var(--dark-neutral-800);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
        overflow: hidden;
    }

    .fieldOption {
        @include flex(center, flex-start);
        @include box(100%, 36px);
        padding: 0 12px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--text-primary);
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
        cursor: pointer;

        &:hover {
            background: var(--surface-overlay);
        }

        &.isActive {
            background: var(--dark-neutral-700);
        }
    }

    &.isReadonly {
        .fieldInput,
        .fieldSelectBtn {
            pointer-events: none;
        }
    }
}
</style>
