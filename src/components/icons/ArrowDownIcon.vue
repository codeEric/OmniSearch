<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        shape-rendering="geometricPrecision">
        <line :color="color" opacity="0.4" x1="12" y1="3" x2="12" y2="19"></line>
        <polyline :color="color" points="19 12 12 19 5 12"></polyline>
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