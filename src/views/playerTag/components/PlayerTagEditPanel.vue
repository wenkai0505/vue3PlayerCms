<template>
    <section class="editPanel" @click.stop>
        <div class="editNoteWrap">
            <textarea
                class="editNote"
                :value="note"
                placeholder="填寫備註..."
                rows="4"
                @input="handleNoteInput"
            ></textarea>
            <span class="editNoteIcon">
                <img :src="editNoteIcon" alt="" aria-hidden="true" />
            </span>
        </div>

        <div class="editFooter">
            <div class="editColors">
                <button
                    v-for="color in colorOptions"
                    :key="color"
                    type="button"
                    class="colorBtn"
                    :class="{ isActive: tagColor === color }"
                    :style="{ background: color }"
                    @click="emit('update:tagColor', color)"
                ></button>
            </div>

            <div class="editActions">
                <button
                    type="button"
                    class="editBtn editBtnGhost"
                    @click="emit('delete')"
                >
                    刪除
                </button>
                <button
                    type="button"
                    class="editBtn editBtnPrimary"
                    @click="emit('save')"
                >
                    保存
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import editNoteIcon from "@/assets/editNoteIcon.svg";
import { playerTagColors } from "@/types/playerTag";
import type { PlayerTagColor } from "@/types/playerTag";

interface Props {
    note?: string;
    tagColor?: PlayerTagColor;
    colorOptions?: PlayerTagColor[];
}

withDefaults(defineProps<Props>(), {
    note: "",
    tagColor: "#00C7E6",
    colorOptions: () => [...playerTagColors],
});

const emit = defineEmits<{
    (e: "update:note", value: string): void;
    (e: "update:tagColor", value: PlayerTagColor): void;
    (e: "save"): void;
    (e: "delete"): void;
}>();

const handleNoteInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit("update:note", target.value);
};
</script>

<style scoped lang="scss">
.editPanel {
    @include box(100%, auto, static);
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: var(--dark-neutral-900);
}

.editNoteWrap {
    position: relative;
}

.editNote {
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

    @include mobile {
        height: 120px;
        padding-right: 48px;
    }
}

.editNote::placeholder {
    color: var(--gray-500);
}

.editNoteIcon {
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

.editFooter {
    @include flex(center, space-between);
    gap: 12px;
    padding: 12px;

    @include mobile {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        padding: 8px 0 0;
    }
}

.editColors {
    @include flex(center, flex-start);
    gap: 12px;
    min-width: 0;
    flex-wrap: wrap;

    @include mobile {
        justify-content: center;
    }
}

.colorBtn {
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

.editActions {
    @include flex(center, flex-end);
    gap: 8px;
    flex-shrink: 0;

    @include mobile {
        width: 100%;

        .editBtn {
            flex: 1;
        }
    }
}

.editBtn {
    @include flex;
    @include box(auto, auto);
    padding: 12px 20px;
    border-radius: var(--radius-lg);
    font-size: 13px;
    font-weight: 700;
    line-height: 16px;
    white-space: nowrap;
    cursor: pointer;
}

.editBtnGhost {
    border: 0.5px solid var(--border-subtle);
    background: var(--surface-overlay);
    color: var(--text-primary);
    box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.editBtnPrimary {
    color: var(--text-primary);
    background: linear-gradient(
        149.53deg,
        var(--color-primary-grad-from) 0%,
        var(--color-primary-grad-to) 100%
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
</style>
