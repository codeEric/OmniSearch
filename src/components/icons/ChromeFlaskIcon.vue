<template>
    <svg xmlns="http://www.w3.org/2000/svg" :height="size" :width="size" viewBox="0 -960 960 960"
        style="fill: var(--icon-color, currentColor);">
        <path
            d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Z" />
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