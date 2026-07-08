<template>
    <div class="tagPage">
        <section class="tagSurface">
            <slot />
        </section>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.tagPage {
    @include box(100%, auto);
    min-height: 100%;
    min-width: 0;
    background: var(--dark-neutral-800);

    .tagSurface {
        @include box(100%, 100%);
        @include flex(stretch, flex-start);
        flex-direction: column;
        gap: 12px;
        background: var(--dark-neutral-900);
        border-radius: var(--radius-md);
        padding: 12px;
        min-width: 0;

        @include mobile {
            gap: 8px;
            padding: 8px;
            border-radius: 0;
        }

        @include pad {
            padding: 10px;
        }
    }
}
</style>
