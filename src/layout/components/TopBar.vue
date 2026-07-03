<template>
    <div class="topBar">
        <div class="topBar__left">
            <img class="topBar__logo" :src="logo" alt="PLAYER CMS" />
        </div>
        <div class="topBar__right">
            <img class="topBar__avatar" :src="user.avatar" :alt="user.name" />
        </div>
    </div>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.svg";
import defaultAvatar from "@/assets/avatar.png";

// 靜態資料，後續改為 API 抓取
const user = {
    name: "Admin",
    avatar: defaultAvatar,
};
</script>

<style scoped lang="scss">
.topBar {
    @include flex;
    justify-content: space-between;
    height: var(--header-height);
    padding: 12px;
    background: var(--dark-neutral-800);

    &__left {
        @include flex(center, flex-start);
    }

    &__logo {
        @include box(auto, 32px);
    }

    &__right {
        @include flex;
    }

    &__avatar {
        @include box(40px, 40px);
        border-radius: 50%;
        object-fit: cover;
    }
}
</style>
