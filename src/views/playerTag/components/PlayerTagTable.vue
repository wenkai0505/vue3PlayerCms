<template>
    <section class="tagTableWrap">
        <section class="tagTable">
            <header class="tableHead">
                <div class="tableCell colTag">標籤</div>
                <div class="tableCell colName">名稱</div>
                <div class="tableCell colCountry">國家</div>
                <div class="tableCell colTime">修改時間</div>
            </header>

            <div class="tableBody">
                <div
                    v-for="(row, index) in rows"
                    :key="row.id"
                    class="tableItem"
                    :class="{ isExpanded: isExpanded(row.id) }"
                >
                    <article
                        class="tableRow"
                        :class="{ isAlt: index % 2 === 1 }"
                        @click="toggleRow(row.id)"
                    >
                        <div class="mobileRow">
                            <span
                                class="mobileAccent"
                                :style="{ background: row.tagColor }"
                            ></span>
                            <div class="mobileMain">
                                <div class="mobileTop">
                                    <span class="mobileName">{{
                                        row.playerName
                                    }}</span>
                                    <span
                                        class="mobileChevron"
                                        :class="{
                                            isExpanded: isExpanded(row.id),
                                        }"
                                        aria-hidden="true"
                                    ></span>
                                </div>
                                <div class="mobileMeta">
                                    <span class="mobileTagName">{{
                                        row.tagName
                                    }}</span>
                                    <span class="mobileDivider"></span>
                                    <span
                                        class="countryPill countryPillCompact"
                                    >
                                        <span class="countryDot"></span>
                                        <span class="countryText">{{
                                            row.country
                                        }}</span>
                                    </span>
                                    <span class="mobileTime">{{
                                        row.modifiedAt
                                    }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="tableCell colTag desktopOnly">
                            <div class="tagPill">
                                <span
                                    class="tagDot"
                                    :style="{ background: row.tagColor }"
                                ></span>
                                <span class="tagText">{{ row.tagName }}</span>
                            </div>
                        </div>

                        <div class="tableCell colName desktopOnly">
                            {{ row.playerName }}
                        </div>

                        <div class="tableCell colCountry desktopOnly">
                            <span class="countryPill">
                                <span class="countryDot"></span>
                                <span class="countryText">{{
                                    row.country
                                }}</span>
                            </span>
                        </div>

                        <div class="tableCell colTime desktopOnly">
                            {{ row.modifiedAt }}
                        </div>
                    </article>

                    <PlayerTagEditPanel
                        v-show="isExpanded(row.id)"
                        :note="row.note"
                        :tag-color="row.tagColor"
                        @update:note="row.note = $event"
                        @update:tag-color="
                            row.tagColor = $event as PlayerTagRow['tagColor']
                        "
                        @save="handleSave(row)"
                        @delete="handleDelete(row)"
                    />
                </div>
            </div>
        </section>

        <footer class="tablePager">
            <div class="pager">
                <button
                    class="pagerIcon"
                    type="button"
                    :disabled="page <= 1"
                    @click="handlePageChange(1)"
                >
                    «
                </button>
                <button
                    class="pagerIcon"
                    type="button"
                    :disabled="page <= 1"
                    @click="handlePageChange(page - 1)"
                >
                    ‹
                </button>
                <template
                    v-for="(item, index) in pageItems"
                    :key="`${item}-${index}`"
                >
                    <span v-if="item === 'ellipsis'" class="pagerEllipsis"
                        >...</span
                    >
                    <button
                        v-else
                        class="pagerNum"
                        :class="{ pagerNumActive: item === page }"
                        type="button"
                        @click="handlePageChange(item)"
                    >
                        {{ item }}
                    </button>
                </template>
                <button
                    class="pagerIcon"
                    type="button"
                    :disabled="page >= totalPages"
                    @click="handlePageChange(page + 1)"
                >
                    ›
                </button>
                <button
                    class="pagerIcon"
                    type="button"
                    :disabled="page >= totalPages"
                    @click="handlePageChange(totalPages)"
                >
                    »
                </button>
            </div>
            <div class="pagerJump">
                <span class="pagerJumpLabel">前往頁數</span>
                <input
                    v-model="jumpPage"
                    class="pagerJumpInput"
                    type="number"
                    min="1"
                    :max="totalPages"
                    @keyup.enter="handleJumpPage"
                />
            </div>
        </footer>
    </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import PlayerTagEditPanel from "./PlayerTagEditPanel.vue";
import type { PlayerTagRow } from "@/types/playerTag";

interface Props {
    rows: PlayerTagRow[];
    loading?: boolean;
    page: number;
    pageSize: number;
    total: number;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits<{
    (e: "save", row: PlayerTagRow): void;
    (e: "delete", row: PlayerTagRow): void;
    (e: "page-change", page: number): void;
}>();

const expandedId = ref<string | null>(null);
const jumpPage = ref(String(props.page));

const totalPages = computed(() => {
    if (props.total <= 0) return 1;
    return Math.ceil(props.total / props.pageSize);
});

const pageItems = computed(() => {
    const current = props.page;
    const last = totalPages.value;
    const items: Array<number | "ellipsis"> = [];
    if (last <= 9) {
        return Array.from({ length: last }, (_, index) => index + 1);
    }
    const pages = new Set<number>([1, last]);
    for (let i = current - 2; i <= current + 2; i += 1) {
        if (i >= 1 && i <= last) pages.add(i);
    }
    const sorted = [...pages].sort((a, b) => a - b);
    sorted.forEach((pageNum, index) => {
        const prevPage = sorted[index - 1];
        if (index > 0 && prevPage !== undefined && pageNum - prevPage > 1) {
            items.push("ellipsis");
        }
        items.push(pageNum);
    });
    return items;
});

watch(
    () => props.page,
    (value) => {
        jumpPage.value = String(value);
    },
);

const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages.value || page === props.page) return;
    emit("page-change", page);
};

const handleJumpPage = () => {
    const target = Number(jumpPage.value);
    if (!target || Number.isNaN(target)) return;
    handlePageChange(target);
};

const isExpanded = (id: string) => expandedId.value === id;

const toggleRow = (id: string) => {
    expandedId.value = expandedId.value === id ? null : id;
};

const handleSave = (row: PlayerTagRow) => {
    emit("save", row);
    expandedId.value = null;
};

const handleDelete = (row: PlayerTagRow) => {
    emit("delete", row);
    if (expandedId.value === row.id) {
        expandedId.value = null;
    }
};
</script>

<style scoped lang="scss">
.tagTableWrap {
    @include box(100%, auto);
    @include flex(stretch, flex-start);
    flex-direction: column;
    min-width: 0;
}

.tagTable {
    @include box(100%, auto, static);
    @include flex(stretch, flex-start);
    flex-direction: column;
    flex: 1;
    min-width: 0;
    background: var(--dark-neutral-900);

    @include pad {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tableHead {
        @include flex(center, flex-start);
        @include box(100%, 40px);
        background: var(--dark-neutral-900);
        border-top-left-radius: var(--radius-md);
        border-top-right-radius: var(--radius-md);
        border: 1px solid var(--dark-neutral-700);

        @include mobile {
            display: none;
        }

        @include pad {
            min-width: 640px;
        }
    }

    .tableBody {
        @include box(100%, auto, static);
        border-bottom-left-radius: var(--radius-md);
        border-bottom-right-radius: var(--radius-md);
        border: 1px solid var(--dark-neutral-700);
        border-top: none;
        overflow: hidden;
        background: transparent;

        @include mobile {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            border: none;
            background: transparent;
        }

        @include pad {
            min-width: 640px;
        }
    }

    .tableItem {
        @include mobile {
            border: 1px solid var(--dark-neutral-700);
            border-radius: var(--radius-md);
            overflow: hidden;
            background: var(--dark-neutral-800);
            transition: border-color 0.15s ease;

            &.isExpanded {
                border-color: rgba(169, 96, 248, 0.45);
            }
        }

        &:last-child {
            border-bottom: none;
        }
    }

    .tableRow {
        @include flex(center, flex-start);
        @include box(100%, 36px);
        cursor: pointer;
        background: var(--dark-neutral-700);

        @include mobile {
            display: block;
            height: auto;
            background: transparent;
        }

        @include pad {
            min-width: 640px;
        }
    }

    .tableRow.isAlt {
        background: var(--dark-neutral-800);

        @include mobile {
            background: transparent;
        }
    }

    .desktopOnly {
        @include mobile {
            display: none !important;
        }
    }

    .tableCell {
        @include flex(center, flex-start);
        @include box(auto, 100%, static);
        padding: 0 12px;
        color: var(--text-primary);
        font-size: 12px;
        line-height: 16px;
        white-space: nowrap;
        border-right: 1px solid var(--table-divider);

        &:last-child {
            border-right: none;
        }

        &.desktopOnly {
            @include mobile {
                display: none !important;
            }
        }
    }

    .mobileRow {
        display: none;

        @include mobile {
            @include flex(stretch, flex-start);
            width: 100%;
            padding: 12px 12px 12px 0;
            gap: 0;
        }
    }

    .mobileAccent {
        @include box(4px, auto, static);
        flex-shrink: 0;
        border-radius: 0 4px 4px 0;
        margin-right: 12px;
    }

    .mobileMain {
        flex: 1;
        min-width: 0;
        padding-right: 4px;
    }

    .mobileTop {
        @include flex(center, space-between);
        gap: 8px;
        margin-bottom: 6px;
    }

    .mobileName {
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mobileChevron {
        @include box(20px, 20px, static);
        @include flex;
        flex-shrink: 0;
        border: 0.5px solid var(--border-subtle);
        border-radius: 50%;
        background: var(--surface-overlay);
        transition: transform 0.2s ease;

        &::after {
            content: "";
            width: 6px;
            height: 6px;
            border-right: 1.5px solid var(--text-secondary);
            border-bottom: 1.5px solid var(--text-secondary);
            transform: rotate(45deg) translate(-1px, -1px);
        }

        &.isExpanded {
            transform: rotate(180deg);
        }
    }

    .mobileMeta {
        @include flex(center, flex-start);
        gap: 8px;
        min-width: 0;
        flex-wrap: wrap;
    }

    .mobileTagName {
        color: var(--text-secondary);
        font-size: 11px;
        line-height: 14px;
        white-space: nowrap;
    }

    .mobileDivider {
        @include box(1px, 12px, static);
        flex-shrink: 0;
        background: var(--table-divider);
    }

    .mobileTime {
        margin-left: auto;
        flex-shrink: 0;
        color: var(--text-secondary);
        font-size: 11px;
        line-height: 14px;
        white-space: nowrap;
    }

    .colTag {
        width: 26%;
    }

    .colName {
        width: 26%;
    }

    .colCountry {
        width: 24%;
    }

    .colTime {
        width: 24%;
        color: var(--text-secondary);
    }
}

.tablePager {
    @include box(100%, 48px, static);
    @include flex(center, space-between);
    flex-shrink: 0;
    padding: 0 12px;
    background: var(--dark-neutral-900);
    gap: 12px;

    @include mobile {
        flex-direction: column;
        align-items: stretch;
        height: auto;
        padding: 12px 0 0;
        gap: 10px;
    }

    @include pad {
        flex-wrap: wrap;
        height: auto;
        padding: 12px;
    }
}

.tagPill {
    @include flex(center, flex-start);
    gap: 8px;

    &.tagPillCompact {
        gap: 6px;
        min-width: 0;
    }

    .tagDot {
        @include box(34px, 14px, static);
        border-radius: 999px;
        flex-shrink: 0;

        &.tagDotCompact {
            width: 20px;
            height: 10px;
        }
    }

    .tagText {
        color: var(--text-primary);
        font-size: 12px;
        line-height: 16px;
    }

    &.tagPillCompact .tagText {
        font-size: 11px;
        line-height: 14px;
        color: var(--text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.countryPill {
    @include flex(center, flex-start);
    gap: 6px;
    min-width: 0;

    &.countryPillCompact {
        gap: 4px;
    }

    .countryDot {
        @include box(14px, 14px, static);
        border-radius: 50%;
        background: #e63757;
        position: relative;
        flex-shrink: 0;
    }

    &.countryPillCompact .countryDot {
        width: 12px;
        height: 12px;
    }

    .countryDot::after {
        content: "✶";
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 8px;
        color: #fff;
        transform: translate(-50%, -50%);
    }

    &.countryPillCompact .countryDot::after {
        font-size: 7px;
    }

    .countryText {
        color: var(--text-primary);
        font-size: 12px;
        line-height: 16px;
    }

    &.countryPillCompact .countryText {
        font-size: 11px;
        line-height: 14px;
        color: var(--text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.pager {
    @include flex(center, flex-start);
    gap: 6px;
    min-width: 0;
    flex-wrap: wrap;

    @include mobile {
        justify-content: center;
        width: 100%;
    }
}

.pagerIcon,
.pagerNum {
    @include box(28px, 28px, static);
    @include flex;
    flex-shrink: 0;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: var(--text-primary);
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    transition:
        background 0.15s ease,
        opacity 0.15s ease;
}

.pagerIcon {
    border: 0.5px solid var(--border-subtle);
    background: var(--surface-overlay);

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

.pagerNum {
    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
}

.pagerNumActive {
    background: rgba(255, 255, 255, 0.15);
}

.pagerEllipsis {
    @include flex;
    min-width: 20px;
    color: var(--text-secondary);
    font-size: 12px;
    padding: 0 2px;
    user-select: none;
}

.pagerJump {
    @include flex(center, flex-start);
    gap: 8px;
    flex-shrink: 0;

    @include mobile {
        justify-content: center;
        width: 100%;
    }
}

.pagerJumpLabel {
    color: var(--text-secondary);
    font-size: 12px;
    white-space: nowrap;
}

.pagerJumpInput {
    @include box(80px, 32px, static);
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 12px;
    background: var(--dark-neutral-700);
    color: var(--text-primary);
    font-size: 12px;
    text-align: center;
    outline: none;
    transition: border-color 0.15s ease;

    &:focus {
        border-color: var(--border-subtle);
    }

    &::placeholder {
        color: var(--text-secondary);
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
}
</style>
