<template>
    <div class="layout">
        <SideBar />
        <div class="layoutMain">
            <TopBar />
            <main class="layoutContent">
                <router-view />
            </main>
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
    @include box(100%, 100vh);
    background: var(--dark-neutral-800);
    overflow: hidden;

    .layoutMain {
        @include box(auto, 100%);
        @include flex(stretch, flex-start);
        flex-direction: column;
        flex: 1;
        min-width: 0;
        min-height: 0;
        background: var(--dark-neutral-800);
    }

    .layoutContent {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
</style>
