<template>
    <svg xmlns="http://www.w3.org/2000/svg" :height="size" viewBox="0 -960 960 960" :width="size"
        style="fill: var(--icon-color, currentColor);">
        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
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