<template>
    <div class="profileAvatar">
        <img class="avatarImage" :src="avatarUrl" alt="玩家頭像" />
        <span class="countryFlag" aria-hidden="true">
            <span class="countryDot"></span>
        </span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    avatarUrl: string;
    countryCode: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.profileAvatar {
    position: relative;
    @include box(144px, 144px);
    flex-shrink: 0;
}

.avatarImage {
    @include box(100%, 100%);
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0 2px rgba(255, 196, 86, 0.45);
}

.countryFlag {
    top: 0;
    right: 0;
    @include flex;
    @include box(36px, 36px, absolute);
    border-radius: 50%;
    background: var(--dark-neutral-900);
}

.countryDot {
    @include box(30px, 30px);
    border-radius: 50%;
    background: #e63757;
    position: relative;

    &::after {
        content: "✶";
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 12px;
        color: #fff;
        transform: translate(-50%, -50%);
    }
}
</style>
