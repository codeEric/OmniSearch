<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect :stroke="color" x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path opacity="0.6" :stroke="color" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
</template>

<script setup lang="ts">

defineProps({
    color: {
        type: String,
        default: '#000000'
    },
    size: {
        type: Number,
        default: 16
    }
});

</script>

<style scoped></style>