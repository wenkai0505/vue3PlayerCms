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
                    v-model="keyword"
                    class="tagCreateInput"
                    type="text"
                    placeholder="搜尋玩家名稱 / 國家"
                    @input="handleSearchInput"
                />
            </div>

            <div v-if="keyword.trim()">
                <div class="tagCreatePlayers" v-if="playerOptions.length > 0">
                    <button
                        v-for="player in playerOptions"
                        :key="player.id"
                        type="button"
                        class="tagCreatePlayerItem"
                        :class="{ isActive: form.playerId === player.id }"
                        @click="handleSelectPlayer(player)"
                    >
                        <span class="playerName">{{ player.name }}</span>
                        <span class="playerCountry">{{ player.country }}</span>
                    </button>
                </div>

                <div class="tagCreateEmpty" v-else-if="!loadingPlayers">
                    找不到符合的玩家
                </div>

                <div class="tagCreateEmpty" v-if="loadingPlayers">
                    載入中...
                </div>
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
                    v-for="item in tagNames"
                    :key="item.id"
                    type="button"
                    class="tagCreateColorBtn"
                    :class="{ isActive: form.tagId === item.id }"
                    :style="{ background: item.tagColor }"
                    :title="item.tagName"
                    @click="form.tagId = item.id"
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
                    :disabled="!canSave"
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
import { searchPlayersApi } from "@/apis/player";
import type { PlayerListItem } from "@/types/player";
import type {
    CreatePlayerTagPayload,
    PlayerTagNameItem,
} from "@/types/playerTag";

interface Props {
    open?: boolean;
    tagNames?: PlayerTagNameItem[];
    excludedPlayerIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
    tagNames: () => [],
    excludedPlayerIds: () => [],
});

const emit = defineEmits<{
    (e: "update:open", value: boolean): void;
    (e: "close"): void;
    (e: "save", payload: CreatePlayerTagPayload): void;
}>();

const visible = computed({
    get: () => props.open,
    set: (value: boolean) => emit("update:open", value),
});

const keyword = ref("");
const playerOptions = ref<PlayerListItem[]>([]);
const loadingPlayers = ref(false);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const form = ref<CreatePlayerTagPayload>({
    playerId: "",
    tagId: props.tagNames[0]?.id ?? "",
    content: "",
    note: "",
});

const canSave = computed(
    () => Boolean(form.value.playerId) && Boolean(form.value.tagId),
);

const fetchPlayers = async () => {
    const kw = keyword.value.trim();
    if (!kw) {
        playerOptions.value = [];
        loadingPlayers.value = false;
        return;
    }

    loadingPlayers.value = true;
    try {
        const res = await searchPlayersApi({
            keyword: kw,
        });

        playerOptions.value = res.list.filter(
            (player) => !props.excludedPlayerIds.includes(player.id),
        );
    } catch (error) {
        console.error(error);
        playerOptions.value = [];
    } finally {
        loadingPlayers.value = false;
    }
};

const handleSelectPlayer = (player: PlayerListItem) => {
    form.value.playerId = player.id;
};

const resetForm = () => {
    keyword.value = "";
    playerOptions.value = [];
    form.value = {
        playerId: "",
        tagId: props.tagNames[0]?.id ?? "",
        content: "",
        note: "",
    };
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            resetForm();
        }
    },
);

watch(
    () => props.tagNames,
    (value) => {
        const firstTag = value[0];
        if (!form.value.tagId && firstTag) {
            form.value.tagId = firstTag.id;
        }
    },
    { deep: true },
);

const handleSearchInput = () => {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        fetchPlayers();
    }, 300);
};

const handleClose = () => {
    visible.value = false;
    emit("close");
};

const handleSave = () => {
    if (!canSave.value) return;

    emit("save", {
        playerId: form.value.playerId,
        tagId: form.value.tagId,
        content: form.value.content.trim(),
        note: form.value.note.trim(),
    });
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

    &:disabled {
        color: var(--text-secondary);
        cursor: not-allowed;
    }
}

.tagCreatePlayers {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}

.tagCreatePlayerItem {
    @include flex(center, space-between);
    @include box(100%, 36px);
    padding: 0 10px;
    border: 1px solid var(--dark-neutral-700);
    border-radius: 10px;
    background: var(--dark-neutral-900);
    color: var(--text-primary);
    cursor: pointer;
    transition: border-color 0.15s ease;

    &.isActive {
        border-color: rgba(169, 96, 248, 0.8);
    }

    .playerName {
        font-size: 12px;
        font-weight: 700;
    }

    .playerCountry {
        font-size: 11px;
        color: var(--text-secondary);
    }
}

.tagCreateEmpty {
    color: var(--text-secondary);
    font-size: 12px;
    text-align: center;
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

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
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
