<template>
    <div class="power-toggle-container" :class="{ 'loaded': isLoaded }">
        <div class="power-switch">
            <input type="checkbox" class="power-toggle-switch-input" :checked="modelValue"
                @change="$emit('update:modelValue', ($event.target as any).checked)" />
            <div class="power-toggle-switch-inner">
                <svg class="power-off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
                    <defs>
                        <linearGradient id="on-gradient" x1="0" y1="0" x2="150" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" style="stop-color: hsl(145, 65%, 45%)" />
                            <stop offset="100%" style="stop-color: hsl(145, 65%, 45%)" />
                        </linearGradient>
                    </defs>
                    <line x1="75" y1="34" x2="75" y2="58" class="line" />
                    <circle cx="75" cy="80" r="35" class="circle" />
                </svg>

                <svg class="power-on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
                    <defs>
                        <linearGradient id="off-gradient" x1="0" y1="0" x2="150" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" style="stop-color: hsl(0, 0%, 85%)" />
                            <stop offset="100%" style="stop-color: hsl(0, 0%, 85%)" />
                        </linearGradient>
                    </defs>
                    <line x1="75" y1="34" x2="75" y2="58" class="line" />
                    <circle cx="75" cy="80" r="35" class="circle" />
                </svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const isLoaded = ref(false);

onMounted(() => {
    requestAnimationFrame(() => {
        isLoaded.value = true;
    });
});

defineProps<{ modelValue: boolean }>();
defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();
</script>

<style scoped></style>