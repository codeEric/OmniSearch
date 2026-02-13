<template>
    <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        transform="rotate(0 0 0)" shape-rendering="geometricPrecision">
        <path
            d="M11.999 10.9382L10.9384 11.9989L6.21967 16.7176C5.92678 17.0105 5.92678 17.4854 6.21967 17.7782C6.51256 18.0711 6.98744 18.0711 7.28033 17.7782L11.999 13.0596L13.0597 11.9989L17.7782 7.28033C18.0711 6.98744 18.0711 6.51256 17.7782 6.21967C17.4854 5.92678 17.0105 5.92678 16.7176 6.21967L11.999 10.9382Z"
            :fill="color" />
        <g opacity="0.4">
            <path
                d="M17.7782 16.7176L13.0597 11.999L11.999 13.0597L16.7176 17.7782C17.0105 18.0711 17.4854 18.0711 17.7782 17.7782C18.0711 17.4854 18.0711 17.0105 17.7782 16.7176Z"
                :fill="color" />
            <path
                d="M6.21967 6.21967C5.92678 6.51256 5.92678 6.98744 6.21967 7.28033L10.9384 11.999L11.999 10.9384L7.28033 6.21967C6.98744 5.92678 6.51256 5.92678 6.21967 6.21967Z"
                :fill="color" />
        </g>
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