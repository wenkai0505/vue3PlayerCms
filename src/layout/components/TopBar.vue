<template>
    <div class="topbar">
        <div class="topbarLeft">
            <img class="topbarLogo" :src="logo" alt="PLAYER CMS" />
        </div>
        <div class="topbarRight">
            <img class="topbarAvatar" :src="user.avatar" :alt="user.name" />
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
.topbar {
    @include flex(center, space-between);
    @include box(100%, var(--header-height));
    flex-shrink: 0;
    padding: 12px;
    background: var(--dark-neutral-800);

    .topbarLeft {
        @include flex(center, flex-start);
    }

    .topbarLogo {
        @include box(auto, 32px);
    }

    .topbarRight {
        @include flex;
    }

    .topbarAvatar {
        @include box(40px, 40px);
        border-radius: 50%;
        object-fit: cover;
    }
}
</style>
