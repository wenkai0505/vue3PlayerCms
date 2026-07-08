<template>
    <section class="profileCard">
        <div class="profileMain">
            <div class="profileIdentity">
                <PlayerProfileAvatar
                    :avatar-url="profile.avatarUrl"
                    :country-code="profile.countryCode"
                />
                <PlayerStatusBadges :badges="profile.statusBadges" />
            </div>

            <div class="profileAccounts">
                <PlayerCopyField label="帳戶編號" :value="profile.accountNo" />
                <PlayerCopyField
                    label="代理商玩家編號"
                    :value="profile.agentPlayerNo"
                />
                <PlayerCopyField
                    label="推薦人代碼"
                    :value="profile.referralCode"
                />
            </div>
        </div>

        <div class="profileLogin">
            <PlayerLoginInfo
                :agent-name="profile.agentName"
                :last-login-at="profile.lastLoginAt"
                :last-login-ip="profile.lastLoginIp"
                :last-login-device="profile.lastLoginDevice"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import type { PlayerProfile } from "@/types/playerProfile";
import PlayerProfileAvatar from "./PlayerProfileAvatar.vue";
import PlayerStatusBadges from "./PlayerStatusBadges.vue";
import PlayerCopyField from "./PlayerCopyField.vue";
import PlayerLoginInfo from "./PlayerLoginInfo.vue";

interface Props {
    profile: PlayerProfile;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.profileCard {
    @include flex(stretch, flex-start);
    width: 100%;
    min-width: 0;
    gap: 24px;
    padding: 12px;
    background: var(--dark-neutral-800);
    border-radius: var(--radius-md);

    @include pad {
        flex-direction: column;
    }

    @include mobile {
        flex-direction: column;
        gap: 16px;
        padding: 8px;
        border-radius: 0;
    }
}

.profileMain {
    @include flex(center, flex-start);
    flex: 1;
    min-width: 0;
    gap: 48px;

    @include pad {
        width: 100%;
    }

    @include mobile {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
        width: 100%;
    }
}

.profileIdentity {
    @include flex(center, center);
    flex-direction: column;
    gap: 24px;
    width: 300px;
    flex-shrink: 0;

    @include mobile {
        width: 100%;
    }
}

.profileAccounts {
    @include flex(stretch, flex-start);
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 14px;
}

.profileLogin {
    flex: 1;
    min-width: 0;
    align-self: stretch;

    @include pad {
        width: 100%;
    }

    @include mobile {
        width: 100%;
    }
}
</style>
