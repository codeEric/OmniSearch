<template>
    <button class="button-component">
        <component :is="icon" />
        {{ text }}
    </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';


const props = defineProps<{
    text?: string,
    icon?: Component
}>();
</script>

<style scoped></style>