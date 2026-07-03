<template>
    <div class="layout">
        <SideBar />
        <div class="layout__main">
            <TopBar />
            <router-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import TopBar from "./components/TopBar.vue";
import SideBar from "./components/SideBar.vue";
</script>

<style scoped lang="scss">
.layout {
    @include flex(stretch, flex-start);
    height: 100vh;
    &__main {
        @include flex(stretch, flex-start);
        flex-direction: column;
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }
}
</style>
