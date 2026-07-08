<template>
    <section class="tagToolbar">
        <div class="toolbarFilters">
            <BaseField
                :model-value="keyword"
                placeholder="搜尋玩家"
                type="text"
                @update:model-value="handleKeywordChange"
            />
            <BaseField
                :model-value="tagName"
                placeholder="所有標籤"
                type="select"
                :options="tagOptions"
                @update:model-value="handleTagChange"
                @change="handleTagFilter"
            />
            <BaseField
                :model-value="country"
                placeholder="所有國家"
                type="select"
                :options="countryOptions"
                @update:model-value="handleCountryChange"
                @change="handleCountryFilter"
            />

            <div class="toolbarActions">
                <button
                    type="button"
                    class="toolbarBtn toolbarBtnGhost"
                    @click="isTagNameModalOpen = true"
                >
                    編輯標籤名
                </button>
                <button
                    type="button"
                    class="toolbarBtn toolbarBtnGhost"
                    @click="isBatchDeleteModalOpen = true"
                >
                    批量刪除
                </button>
            </div>
        </div>

        <button
            type="button"
            class="toolbarBtn toolbarBtnPrimary"
            @click="isCreateModalOpen = true"
        >
            新增玩家標記
        </button>
    </section>

    <PlayerTagNameModal
        v-model:open="isTagNameModalOpen"
        @save="handleTagNameSave"
    />

    <PlayerTagCreateModal
        v-model:open="isCreateModalOpen"
        :tag-names="tagNames"
        :excluded-player-ids="excludedPlayerIds"
        @save="handleCreateSave"
    />

    <PlayerTagBatchDeleteModal
        v-model:open="isBatchDeleteModalOpen"
        @save="handleBatchDeleteSave"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BaseField from "@/components/form/BaseField.vue";
import PlayerTagNameModal from "./PlayerTagNameModal.vue";
import PlayerTagCreateModal from "./PlayerTagCreateModal.vue";
import PlayerTagBatchDeleteModal from "./PlayerTagBatchDeleteModal.vue";
import type {
    CreatePlayerTagPayload,
    PlayerTagNameItem,
} from "@/types/playerTag";

interface Props {
    keyword?: string;
    tagName?: string;
    country?: string;
    tagOptions?: string[];
    tagNames?: PlayerTagNameItem[];
    excludedPlayerIds?: string[];
    countryOptions?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    keyword: "",
    tagName: "",
    country: "",
    tagOptions: () => [],
    tagNames: () => [],
    excludedPlayerIds: () => [],
    countryOptions: () => [],
});

const emit = defineEmits<{
    (e: "update:keyword", value: string): void;
    (e: "update:tagName", value: string): void;
    (e: "update:country", value: string): void;
    (e: "search"): void;
    (e: "filter"): void;
    (e: "save-tag-names", items: PlayerTagNameItem[]): void;
    (e: "batch-delete", ids: string[]): void;
    (e: "create", payload: CreatePlayerTagPayload): void;
}>();

const isTagNameModalOpen = ref(false);
const isCreateModalOpen = ref(false);
const isBatchDeleteModalOpen = ref(false);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const tagOptions = computed(() => [
    { label: "所有標籤", value: "" },
    ...props.tagOptions.map((name) => ({
        label: name,
        value: name,
    })),
]);

const countryOptions = computed(() => [
    { label: "所有國家", value: "" },
    ...props.countryOptions.map((name) => ({
        label: name,
        value: name,
    })),
]);

const handleKeywordChange = (value: string) => {
    emit("update:keyword", value);

    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => {
        emit("search");
    }, 300);
};

const handleTagChange = (value: string) => {
    emit("update:tagName", value);
};

const handleTagFilter = () => {
    emit("filter");
};

const handleCountryChange = (value: string) => {
    emit("update:country", value);
};

const handleCountryFilter = () => {
    emit("filter");
};

const handleTagNameSave = (items: PlayerTagNameItem[]) => {
    emit("save-tag-names", items);
    isTagNameModalOpen.value = false;
};

const handleCreateSave = (payload: CreatePlayerTagPayload) => {
    emit("create", payload);
    isCreateModalOpen.value = false;
};

const handleBatchDeleteSave = (ids: string[]) => {
    emit("batch-delete", ids);
    isBatchDeleteModalOpen.value = false;
};
</script>

<style scoped lang="scss">
.tagToolbar {
    @include flex(center, space-between);
    width: 100%;
    min-width: 0;
    gap: 16px;

    @include mobile {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    @include pad {
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .toolbarFilters {
        @include flex(center, flex-start);
        min-width: 0;
        gap: 16px;
        flex: 1;
        flex-wrap: wrap;

        @include mobile {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
            width: 100%;
        }

        @include pad {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }
    }

    .toolbarActions {
        @include flex(center, flex-start);
        gap: 16px;
        flex-shrink: 0;

        @include mobile {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            width: 100%;
        }

        @include pad {
            gap: 12px;
        }
    }

    .toolbarBtn {
        @include flex;
        @include box(auto, 40px);
        flex-shrink: 0;
        padding: 0 20px;
        border-radius: 16px;
        font-size: 13px;
        font-weight: 700;
        line-height: 16px;
        white-space: nowrap;
        cursor: pointer;

        @include mobile {
            width: 100%;
            padding: 0 12px;
        }
    }

    .toolbarBtnGhost {
        border: 0.5px solid var(--border-subtle);
        background: var(--surface-overlay);
        color: var(--text-primary);
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .toolbarBtnPrimary {
        color: var(--text-primary);
        background: linear-gradient(
            161.847deg,
            var(--color-primary-grad-from) 0%,
            var(--color-primary-grad-to) 100%
        );
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);

        @include mobile {
            width: 100%;
        }

        @include pad {
            margin-left: auto;
        }
    }
}
</style>
