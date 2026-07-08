<template>
    <PageSurface>
        <PlayerProfileCard v-if="playerProfile" :profile="playerProfile" />
    </PageSurface>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import PageSurface from "@/components/layout/PageSurface.vue";
import PlayerProfileCard from "./components/PlayerProfileCard.vue";
import { getPlayerProfileApi } from "@/apis/playerProfile";
import type { PlayerProfile } from "@/types/playerProfile";

const playerProfile = ref<PlayerProfile | null>(null);

onMounted(async () => {
    playerProfile.value = await getPlayerProfileApi("p100");
});
</script>
