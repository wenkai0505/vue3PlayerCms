<template>
    <section class="underDev">
        <div class="underDevCard">
            <span class="underDevAccent" aria-hidden="true"></span>

            <div class="underDevIcon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none">
                    <circle
                        cx="24"
                        cy="24"
                        r="14"
                        stroke="currentColor"
                        stroke-width="2"
                    />
                    <path
                        d="M24 16v10"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <circle cx="24" cy="32" r="1.5" fill="currentColor" />
                </svg>
            </div>

            <h2 class="underDevTitle">本頁面開發中</h2>
            <p class="underDevDesc">此功能尚未啟用，敬請期待。</p>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.underDev {
    @include flex;
    flex: 1;
    width: 100%;
    min-height: calc(100vh - var(--header-height) - 48px);
    padding: 24px 12px;

    @include mobile {
        min-height: calc(100vh - var(--header-height) - 32px);
        padding: 16px 8px;
    }
}

.underDevCard {
    @include flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    padding: 40px 28px;
    border: 0.5px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--surface-overlay);
    text-align: center;
    position: relative;
    overflow: hidden;

    @include mobile {
        padding: 32px 20px;
    }
}

.underDevAccent {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 96px;
    height: 3px;
    border-radius: 0 0 4px 4px;
    background: linear-gradient(
        90deg,
        var(--color-primary-grad-from),
        var(--color-primary-grad-to)
    );
}

.underDevIcon {
    @include flex;
    @include box(56px, 56px);
    margin-bottom: 16px;
    border-radius: 50%;
    background: rgba(169, 96, 248, 0.12);
    color: var(--color-primary);

    svg {
        width: 28px;
        height: 28px;
    }
}

.underDevTitle {
    margin: 0 0 8px;
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
}

.underDevDesc {
    margin: 0;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.2px;
}
</style>
