<template>
    <div class="Layout">
        <div class="box"></div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.box {
    @include box(300px, 300px);
    @include flex;
    background: var(--color-brand);
    color: var(--color-text);
}
</style>
