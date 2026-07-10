<template>
    <div class="timelineCardDetail">
        <template v-if="event.pokerDetail">
            <img
                class="timelineCardDetail__image"
                :src="event.pokerDetail.imageUrl"
                :alt="event.title"
            />
            <div class="timelineCardDetail__actions">
                <button
                    v-if="event.pokerDetail.replayUrl"
                    type="button"
                    class="timelineCardDetail__actionBtn"
                    aria-label="播放"
                    @click="handleReplay"
                >
                    ▶
                </button>
                <button
                    v-if="event.pokerDetail.downloadUrl"
                    type="button"
                    class="timelineCardDetail__actionBtn"
                    aria-label="下載"
                    @click="handleDownload"
                >
                    ↓
                </button>
                <button
                    v-if="event.pokerDetail.shareUrl"
                    type="button"
                    class="timelineCardDetail__actionBtn"
                    aria-label="分享"
                    @click="handleShare(event.pokerDetail.shareUrl)"
                >
                    ⤴
                </button>
            </div>
        </template>

        <template v-else-if="event.promotionDetail">
            <img
                class="timelineCardDetail__image"
                :src="event.promotionDetail.bannerUrl"
                :alt="event.title"
            />

            <p
                v-if="event.promotionDetail.subtitle"
                class="timelineCardDetail__subtitle"
            >
                {{ event.promotionDetail.subtitle }}
            </p>

            <p
                v-if="event.promotionDetail.body"
                class="timelineCardDetail__body"
            >
                {{ event.promotionDetail.body }}
            </p>

            <div class="timelineCardDetail__footer">
                <button
                    v-if="event.promotionDetail.ctaLabel"
                    type="button"
                    class="timelineCardDetail__cta"
                    @click="handleCta"
                >
                    {{ event.promotionDetail.ctaLabel }}
                </button>

                <button
                    v-if="event.promotionDetail.shareUrl"
                    type="button"
                    class="timelineCardDetail__actionBtn timelineCardDetail__actionBtnEnd"
                    aria-label="分享"
                    @click="handleShare(event.promotionDetail.shareUrl)"
                >
                    ⤴
                </button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { copyToClipboard } from "@/utils/copyToClipboard";
import type { TimelineEvent } from "@/types/timeline";

interface Props {
    event: TimelineEvent;
}

const props = defineProps<Props>();

const handleReplay = () => {
    const url = props.event.pokerDetail?.replayUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
};

const handleDownload = () => {
    const url = props.event.pokerDetail?.downloadUrl;
    if (!url) return;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "";
    anchor.click();
};

const handleShare = async (url?: string) => {
    if (!url) return;
    await copyToClipboard(url);
};

const handleCta = () => {
    const url = props.event.promotionDetail?.ctaUrl;
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
};
</script>

<style scoped lang="scss">
.timelineCardDetail {
    @include flex(stretch, flex-start);
    width: 100%;
    flex-direction: column;
    gap: var(--space-sm);

    &__image {
        width: 100%;
        height: 400px;
        border-radius: var(--radius-md);
        object-fit: cover;

        @include mobile {
            height: 220px;
        }
    }

    &__subtitle {
        @include text-body-bold;
        margin: 0;
        width: 100%;
        color: var(--text-primary);
    }

    &__body {
        margin: 0;
        width: 100%;
        font-size: var(--font-size-body);
        line-height: 1.3;
        letter-spacing: 1.3px;
        color: var(--text-primary);
    }

    &__footer {
        @include flex(center, space-between);
        width: 100%;
        gap: var(--space-sm);
    }

    &__cta {
        @include flex;
        @include primary-btn;
        @include text-body-bold;
        height: var(--control-height);
        padding: 0 20px;
    }

    &__actions {
        @include flex(center, flex-end);
        width: 100%;
        gap: var(--space-sm);
    }

    &__actionBtn {
        @include flex;
        @include box(var(--control-height), var(--control-height));
        @include overlay-btn;
        font-size: 16px;
    }

    &__actionBtnEnd {
        margin-left: auto;
    }
}
</style>
