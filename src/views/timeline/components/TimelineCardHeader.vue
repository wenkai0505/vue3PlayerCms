<template>
    <div class="timelineCardHeader">
        <div class="timelineCardHeader__icon">
            <img :src="iconSrc" :alt="event.title" />
        </div>

        <div class="timelineCardHeader__content">
            <h3 class="timelineCardHeader__title">{{ event.title }}</h3>
            <span v-if="event.tag" class="timelineCardHeader__tag">
                {{ event.tag }}
            </span>
            <p v-if="event.description" class="timelineCardHeader__desc">
                {{ event.description }}
            </p>
        </div>

        <button
            v-if="event.expandable"
            type="button"
            class="timelineCardHeader__toggle"
            :class="{ isExpanded: expanded }"
            :aria-expanded="expanded"
            :aria-label="expanded ? '收合內容' : '展開內容'"
            @click.stop="emit('toggle')"
        >
            <img :src="iconArrowDown" alt="" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import iconArrowDown from "@/assets/arrorDown.svg";
import { getIconSrc } from "@/composables/useTimelineTheme";
import type { TimelineEvent } from "@/types/timeline";

interface Props {
    event: TimelineEvent;
    expanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    expanded: false,
});

const emit = defineEmits<{
    (e: "toggle"): void;
}>();

const iconSrc = computed(() => getIconSrc(props.event.icon));
</script>

<style scoped lang="scss">
.timelineCardHeader {
    @include flex(flex-start, flex-start);
    gap: var(--space-sm);
    width: 100%;
    min-width: 0;

    &__icon {
        @include flex;
        @include box(40px, 40px);
        flex-shrink: 0;
        border-radius: var(--radius-sm);
        background: var(--text-primary);

        img {
            @include box(24px, 24px);
        }
    }

    &__content {
        @include flex(flex-start, center);
        flex: 1;
        flex-direction: column;
        gap: var(--space-xs);
        min-width: 0;
    }

    &__title {
        margin: 0;
        width: 100%;
        font-size: 25px;
        font-weight: 600;
        line-height: 1.3;
        color: var(--text-primary);
        word-break: break-word;
    }

    &__tag {
        @include flex;
        padding: 4px var(--space-sm);
        border-radius: var(--radius-md);
        background: var(--text-primary);
        font-size: var(--font-size-body);
        line-height: 1.3;
        letter-spacing: 1.3px;
        color: var(--text-placeholder);
        white-space: nowrap;
    }

    &__desc {
        margin: 0;
        width: 100%;
        font-size: 10px;
        line-height: 13px;
        color: var(--text-primary);
        word-break: break-word;
    }

    &__toggle {
        @include flex;
        @include box(20px, 20px);
        flex-shrink: 0;
        border: 0;
        border-radius: 50%;
        background: var(--text-primary);
        cursor: pointer;
        transition: transform 0.2s ease;

        img {
            @include box(12px, 12px);
        }

        &.isExpanded {
            transform: rotate(180deg);
        }
    }
}
</style>
