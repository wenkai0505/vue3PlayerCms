<template>
    <section class="texasToolbar">
        <PageDateTopbar
            :preset="preset"
            :start-date="startDate"
            :end-date="endDate"
            :disabled="disabled"
            @update:preset="handlePresetChange"
            @update:dateRange="handleDateRangeChange"
            @refresh="emit('refresh')"
        />
    </section>
</template>

<script setup lang="ts">
import PageDateTopbar from "@/components/common/PageDateTopbar.vue";
import type { TexasPreset } from "@/types/texas";

interface Props {
    preset?: TexasPreset;
    startDate?: string;
    endDate?: string;
    disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
    disabled: false,
});

const emit = defineEmits<{
    (e: "update:preset", value: TexasPreset): void;
    (e: "update:date-range", startDate: string, endDate: string): void;
    (e: "refresh"): void;
}>();

const handlePresetChange = (value: string) => {
    emit("update:preset", value as TexasPreset);
};

const handleDateRangeChange = (startDate: string, endDate: string) => {
    emit("update:date-range", startDate, endDate);
};
</script>

<style scoped lang="scss">
.texasToolbar {
    width: 100%;
    min-width: 0;
}
</style>
