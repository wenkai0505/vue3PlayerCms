<template>
    <section class="pageTopbar">
        <div class="barMain">
            <template v-if="mode === 'preset'">
                <div class="presetTabs">
                    <button
                        v-for="item in presets"
                        :key="item.value"
                        type="button"
                        class="presetTab"
                        :class="{ isActive: isPresetActive(item.value) }"
                        :disabled="disabled"
                        @click="handlePresetClick(item.value)"
                    >
                        {{ item.label }}
                    </button>
                </div>

                <div class="dateWrap">
                    <el-date-picker
                        v-model="dateRange"
                        class="dateRangeField"
                        type="daterange"
                        range-separator=" - "
                        format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD"
                        :teleported="true"
                        :disabled="disabled"
                        :clearable="false"
                        :editable="false"
                        unlink-panels
                        popper-class="datePickerPop"
                        @change="handleDateRangeChange"
                    >
                        <template #prefix-icon>
                            <svg
                                class="dateIcon"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    d="M6.25 2.5V4.375M13.75 2.5V4.375M3.125 7.8125H16.875M4.375 16.875H15.625C16.4534 16.875 17.125 16.2034 17.125 15.375V5.625C17.125 4.79657 16.4534 4.125 15.625 4.125H4.375C3.54657 4.125 2.875 4.79657 2.875 5.625V15.375C2.875 16.2034 3.54657 16.875 4.375 16.875Z"
                                    stroke="currentColor"
                                    stroke-width="1.25"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <circle
                                    cx="13.75"
                                    cy="13.125"
                                    r="2.5"
                                    stroke="currentColor"
                                    stroke-width="1.1"
                                />
                                <path
                                    d="M13.75 12.1875V13.125H14.6875"
                                    stroke="currentColor"
                                    stroke-width="1.1"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </template>
                    </el-date-picker>
                </div>
            </template>

            <template v-else>
                <slot name="main" />
            </template>
        </div>

        <div class="barActions">
            <div v-if="showFilter" class="filterWrap">
                <button
                    type="button"
                    class="iconBtn"
                    :class="{ isActive: filterOpen }"
                    :disabled="disabled"
                    aria-label="過濾"
                    @click="emit('toggleFilter')"
                >
                    ☰
                </button>

                <div v-if="filterOpen" class="filterPanel">
                    <slot name="filter" />
                </div>
            </div>

            <slot name="actions" />

            <button
                type="button"
                class="iconBtn"
                :disabled="disabled"
                aria-label="刷新"
                @click="emit('refresh')"
            >
                ↻
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

type PresetValue = string;

interface PresetItem<T extends PresetValue = PresetValue> {
    label: string;
    value: T;
}

interface Props<T extends PresetValue = PresetValue> {
    mode?: "preset" | "custom";
    preset?: T;
    startDate?: string;
    endDate?: string;
    presets?: Array<PresetItem<T>>;
    showFilter?: boolean;
    filterOpen?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    mode: "preset",
    presets: () =>
        [
            { label: "本年", value: "year" },
            { label: "本月", value: "month" },
            { label: "本周", value: "week" },
        ] as Array<PresetItem<any>>,
    showFilter: false,
    filterOpen: false,
    disabled: false,
});

const emit = defineEmits<{
    (e: "update:preset", value: PresetValue): void;
    (e: "update:dateRange", startDate: string, endDate: string): void;
    (e: "toggleFilter"): void;
    (e: "refresh"): void;
}>();

/** 有自訂日期時，preset tab 都不亮 */
const isPresetActive = (value: PresetValue) => {
    if (props.startDate && props.endDate) return false;
    return props.preset === value;
};

/** 只有 parent 傳入 start/end 時才顯示日期，preset 模式保持空白 */
const dateRange = ref<[string, string] | null>(
    props.startDate && props.endDate ? [props.startDate, props.endDate] : null,
);

watch(
    () => [props.startDate, props.endDate] as const,
    ([startDate, endDate]) => {
        dateRange.value = startDate && endDate ? [startDate, endDate] : null;
    },
);

const handlePresetClick = (value: PresetValue) => {
    dateRange.value = null;
    emit("update:preset", value);
};

const handleDateRangeChange = (value: [string, string] | null) => {
    if (!value) return;
    emit("update:dateRange", value[0], value[1]);
};
</script>

<style scoped lang="scss">
.pageTopbar {
    @include flex(center, space-between);
    width: 100%;
    min-width: 0;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);

    @include mobile {
        flex-direction: column;
        align-items: stretch;
    }

    .barMain {
        @include flex(center, flex-start);
        flex: 1;
        min-width: 0;
        gap: var(--space-xs);
        flex-wrap: wrap;
    }

    .presetTabs {
        @include flex;
        gap: 4px;
        width: 240px;
        height: var(--control-height);
        padding: 4px;
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-pill);
        background: var(--dark-neutral-900);
        box-sizing: border-box;
        flex-shrink: 0;

        @include mobile {
            width: 100%;
        }

        .presetTab {
            @include flex;
            @include text-body-bold;
            flex: 1;
            height: 100%;
            border: 0;
            border-radius: var(--radius-pill);
            background: transparent;
            color: var(--text-placeholder);
            cursor: pointer;

            &:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }

            &.isActive {
                background: var(--color-primary);
                color: var(--text-primary);
            }
        }
    }

    .dateWrap {
        flex: 1;
        min-width: 240px;
        max-width: 320px;

        @include mobile {
            width: 100%;
            max-width: none;
        }

        // EP 2.x：dateRangeField 在 Tooltip 內層 trigger，需 :deep 才能套到
        :deep(.dateRangeField) {
            @include box(100%, var(--control-height));
            padding: 0 16px;
            border: 0;
            border-radius: 20px;
            background: var(--dark-neutral-900) !important;
            box-shadow: 0 0 0 1px var(--border-date) inset !important;

            &:hover,
            &.is-active,
            &.is-focus {
                background: var(--dark-neutral-900) !important;
                box-shadow: 0 0 0 1px var(--border-date) inset !important;
            }

            .el-range-input {
                @include text-body-bold;
                color: var(--text-primary);
                background: transparent;

                &::placeholder {
                    color: var(--text-placeholder);
                }
            }

            .el-range-separator {
                @include text-body-bold;
                flex: 0;
                padding: 0 4px;
                color: var(--text-primary);
            }

            .el-range__close-icon {
                display: none;
            }

            .el-range__icon,
            .el-input__icon {
                @include flex;
                margin-right: 6px;
                color: var(--text-primary);
            }
        }

        .dateIcon {
            color: var(--text-primary);
            flex-shrink: 0;
        }
    }

    .barActions {
        @include flex(center, flex-end);
        gap: var(--space-sm);
        flex-shrink: 0;

        .filterWrap {
            position: relative;

            .filterPanel {
                position: absolute;
                top: calc(100% + var(--space-xs));
                right: 0;
                z-index: 30;
            }
        }

        .iconBtn {
            @include flex;
            @include box(var(--control-height), var(--control-height));
            @include overlay-btn;
            font-size: 18px;

            &:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }

            &.isActive {
                box-shadow: var(--shadow-overlay-active);
            }
        }
    }
}
</style>

<!-- popup 被 teleported 到 body，需 global style -->
<style lang="scss">
.datePickerPop {
    --el-datepicker-active-color: var(--color-primary);
    --el-datepicker-hover-text-color: var(--text-primary);
    --el-datepicker-inrange-bg-color: var(--color-primary-soft);
    --el-datepicker-inrange-hover-bg-color: var(--color-primary-soft-hover);
    --el-bg-color-overlay: var(--dark-neutral-800);
    --el-text-color-primary: var(--text-primary);
    --el-text-color-regular: var(--text-secondary);
    --el-text-color-secondary: var(--text-placeholder);
    --el-border-color-light: var(--dark-neutral-700);
    --el-fill-color-blank: var(--dark-neutral-900);
    --el-fill-color-light: var(--dark-neutral-700);
    --el-color-primary: var(--color-primary);

    border: 1px solid var(--dark-neutral-700) !important;
    background: var(--dark-neutral-800) !important;

    .el-picker-panel__body {
        background: var(--dark-neutral-800);
    }

    .el-date-table td.available:hover .el-date-table-cell__text {
        color: var(--text-primary);
    }

    .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
        background-color: var(--color-primary);
        color: var(--text-primary);
    }

    .el-date-table td.in-range .el-date-table-cell {
        background-color: var(--color-primary-soft);
    }

    .el-picker-panel__icon-btn {
        color: var(--text-secondary);

        &:hover {
            color: var(--text-primary);
        }
    }

    .el-date-range-picker__header {
        color: var(--text-primary);
    }

    .el-date-table th {
        color: var(--text-secondary);
        border-bottom-color: var(--dark-neutral-700);
    }
}
</style>
