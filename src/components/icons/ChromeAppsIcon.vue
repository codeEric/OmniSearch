<template>
    <svg :width="size" :height="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="6" height="6" fill="#EA4335" />
        <rect x="9" y="2" width="6" height="6" fill="#EA4335" />
        <rect x="16" y="2" width="6" height="6" fill="#EA4335" />

        <rect x="2" y="9" width="6" height="6" fill="#34A853" />
        <rect x="9" y="9" width="6" height="6" fill="#4285F4" />
        <rect x="16" y="9" width="6" height="6" fill="#FBBC05" />

        <rect x="2" y="16" width="6" height="6" fill="#34A853" />
        <rect x="9" y="16" width="6" height="6" fill="#FBBC05" />
        <rect x="16" y="16" width="6" height="6" fill="#FBBC05" />
    </svg>
</template>

<script setup lang="ts">

defineProps({
    size: {
        type: Number,
        default: 16
    }
});

</script>

<style scoped></style>