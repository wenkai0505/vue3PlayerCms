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
    gap: 12px;

    @include mobile {
        flex-direction: column;
        align-items: stretch;
    }

    .barMain {
        @include flex(center, flex-start);
        flex: 1;
        min-width: 0;
        gap: 8px;
        flex-wrap: wrap;
    }

    .presetTabs {
        @include flex;
        gap: 4px;
        width: 240px;
        height: 40px;
        padding: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 999px;
        background: #121826;
        box-sizing: border-box;
        flex-shrink: 0;

        @include mobile {
            width: 100%;
        }

        .presetTab {
            @include flex;
            flex: 1;
            min-width: 0;
            height: 32px;
            border: 0;
            border-radius: 16px;
            background: transparent;
            color: #555;
            font-family: Inter, sans-serif;
            font-size: 13px;
            font-weight: 700;
            line-height: 16px;
            cursor: pointer;
            white-space: nowrap;

            &:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }

            &.isActive {
                border-radius: 999px;
                color: #fff;
                background: linear-gradient(
                    156.8deg,
                    var(--color-primary-grad-from) 0%,
                    var(--color-primary-grad-to) 100%
                );
                box-shadow: var(--shadow-primary-inset);
            }
        }
    }

    .dateWrap {
        width: 240px;
        flex-shrink: 0;

        @include mobile {
            width: 100%;
        }

        /*
         * Figma Input 774:64306
         * bg #121826 / border #333 / radius 20px / padding 8 16 / 13px Bold 白字
         * EP 根節點同時是 .el-date-editor + .el-input__wrapper
         */
        :deep(.dateRangeField.el-date-editor) {
            width: 100% !important;
            height: 40px !important;
            min-height: 40px !important;
            padding: 8px 16px !important;
            gap: 8px;
            border: 0 !important;
            border-radius: 20px !important;
            background-color: #121826 !important;
            box-shadow: 0 0 0 1px #333 inset !important;
            box-sizing: border-box;
            cursor: pointer;
            --el-date-editor-width: 100%;
            --el-input-bg-color: #121826;
            --el-input-border-color: #333;
            --el-input-hover-border-color: #444;
            --el-input-focus-border-color: #a960f8;
            --el-fill-color-blank: #121826;
            --el-text-color-regular: #fff;
            --el-text-color-placeholder: #757575;

            &:hover,
            &.is-active,
            &.is-focus {
                background-color: #121826 !important;
                box-shadow: 0 0 0 1px #a960f8 inset !important;
            }

            &.is-disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .el-range__icon {
                @include flex;
                flex-shrink: 0;
                width: 20px;
                height: 20px;
                margin: 0;
                color: #fff;

                .dateIcon {
                    display: block;
                }
            }

            .el-range-input {
                flex: 1;
                min-width: 0;
                width: auto;
                color: #fff;
                font-family: Inter, sans-serif;
                font-size: 13px;
                font-weight: 700;
                line-height: 16px;
                background: transparent;

                &::placeholder {
                    color: #757575;
                }
            }

            .el-range-separator {
                flex: 0;
                padding: 0 4px;
                color: #fff;
                font-family: Inter, sans-serif;
                font-size: 13px;
                font-weight: 700;
                line-height: 16px;
            }

            .el-range__close-icon {
                display: none;
            }
        }
    }

    .barActions {
        @include flex(center, flex-end);
        gap: 12px;
        flex-shrink: 0;

        .filterWrap {
            position: relative;

            .filterPanel {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                z-index: 30;
            }
        }

        .iconBtn {
            @include flex;
            @include box(40px, 40px);
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
    --el-datepicker-active-color: #a960f8;
    --el-datepicker-hover-text-color: #ffffff;
    --el-datepicker-inrange-bg-color: rgba(169, 96, 248, 0.18);
    --el-datepicker-inrange-hover-bg-color: rgba(169, 96, 248, 0.28);
    --el-bg-color-overlay: #1a2033;
    --el-text-color-primary: #ffffff;
    --el-text-color-regular: #adb3d4;
    --el-text-color-secondary: #757575;
    --el-border-color-light: #242b42;
    --el-fill-color-blank: #121826;
    --el-fill-color-light: #242b42;
    --el-color-primary: #a960f8;

    border: 1px solid #242b42 !important;
    border-radius: 12px !important;
    background: #1a2033 !important;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45) !important;

    &.el-popper.is-light {
        border-color: #242b42 !important;
        background: #1a2033 !important;
    }

    .el-popper__arrow::before {
        border-color: #242b42 !important;
        background: #1a2033 !important;
    }

    .el-picker-panel {
        border: 0;
        background: transparent;
        color: #fff;
    }

    .el-date-range-picker__content.is-left {
        border-right: 1px solid #242b42;
    }

    .el-date-range-picker__header,
    .el-picker-panel__icon-btn:hover {
        color: #fff;
    }

    .el-picker-panel__icon-btn {
        color: #adb3d4;
    }

    .el-date-table th {
        color: #757575;
        border-bottom-color: #242b42;
    }

    .el-date-table td {
        color: #fff;

        &.next-month,
        &.prev-month {
            color: #555;
        }

        &.today .el-date-table-cell__text {
            color: #a960f8;
            font-weight: 700;
        }

        &.in-range .el-date-table-cell {
            background-color: rgba(169, 96, 248, 0.18);
        }

        &.start-date .el-date-table-cell__text,
        &.end-date .el-date-table-cell__text,
        &.current:not(.disabled) .el-date-table-cell__text {
            background: linear-gradient(157deg, #a178f9 0%, #a45df7 100%);
            color: #fff;
        }
    }

    .el-date-table-cell__text {
        border-radius: 999px;
    }

    .el-picker-panel__footer {
        border-top: 1px solid #242b42;
        background: #1a2033;
    }

    .el-picker-panel__link-btn,
    .el-button.is-text {
        color: #adb3d4;

        &:hover {
            color: #fff;
        }
    }

    .el-button.is-plain {
        border-color: #242b42;
        color: #fff;
        background: #121826;

        &:hover {
            border-color: #a960f8;
            background: rgba(169, 96, 248, 0.12);
        }
    }
}
</style>
