<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path :color="color" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
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