<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none" :stroke="color"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision">
        <path :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z" />
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