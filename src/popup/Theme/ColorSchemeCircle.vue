<template>
    <button class="color-scheme-circle" :style="{ '--topColor': topColor, '--bottomColor': bottomColor }"
        @click="emit('onClick')"></button>
</template>

<script setup lang="ts">

const props = defineProps<{
    topColor: number,
    bottomColor: number
}>();

const emit = defineEmits<{
    (e: 'onClick'): () => void
}>();

</script>

<style scoped></style>