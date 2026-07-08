<template>
    <section class="loginInfo">
        <div class="loginInfoItem">
            <p class="loginInfoLabel">所屬代理</p>
            <p class="loginInfoValue">{{ agentName }}</p>
        </div>

        <div class="loginInfoDivider"></div>

        <div class="loginInfoRow">
            <div class="loginInfoItem">
                <p class="loginInfoLabel">上次登入時間</p>
                <p class="loginInfoValue">{{ lastLoginAt }}</p>
            </div>
            <div class="loginInfoItem">
                <p class="loginInfoLabel">上次登入IP</p>
                <p class="loginInfoValue">{{ lastLoginIp }}</p>
            </div>
            <div class="loginInfoItem">
                <p class="loginInfoLabel">上次登入裝置</p>
                <span class="deviceBadge">{{ lastLoginDevice }}</span>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { LoginDevice } from "@/types/playerProfile";

interface Props {
    agentName: string;
    lastLoginAt: string;
    lastLoginIp: string;
    lastLoginDevice: LoginDevice;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.loginInfo {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 20px;
    height: 100%;
    padding: 24px;
    background: var(--dark-neutral-900);
    border-radius: var(--radius-md);
}

.loginInfoDivider {
    width: 100%;
    height: 1px;
    background: var(--dark-neutral-700);
}

.loginInfoRow {
    @include flex(center, flex-start);
    gap: 20px;
    width: 100%;
    flex-wrap: wrap;
}

.loginInfoItem {
    @include flex(stretch, flex-start);
    flex-direction: column;
    gap: 4px;
    width: 160px;
    min-width: 0;
}

.loginInfoLabel {
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 700;
    line-height: 14px;
    letter-spacing: 0.6px;
}

.loginInfoValue {
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    letter-spacing: 0.6px;
    word-break: break-word;
}

.deviceBadge {
    @include flex;
    align-self: flex-start;
    padding: 5px 13px;
    border: 1px solid var(--dark-neutral-700);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0.2px;
    white-space: nowrap;
}
</style>
