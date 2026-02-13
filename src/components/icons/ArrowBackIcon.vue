<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        shape-rendering="geometricPrecision">
        <path :color="color" opacity="0.4" d="M20 4v7a4 4 0 0 1-4 4H4"></path>
        <polyline :color="color" points="9 10 4 15 9 20"></polyline>
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