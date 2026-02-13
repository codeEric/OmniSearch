<template>
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 20H19V18H5V20ZM19 9H15V3H9V9H5L12 16L19 9Z"
            style="fill: var(--icon-color, currentColor);" />

        <path d="M12 16L19 9H15V3H9V9H5L12 16Z" style="fill: var(--icon-color, currentColor);" opacity="0.2" />
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