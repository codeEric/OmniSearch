<template>
    <div class="statusbar-card">
        <span v-if="keyName" :class="textClass">{{ keyName }}</span>
        <component v-else :is="icon" color="#000000" :size="18" />
    </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue';

const props = defineProps<{
    keyName?: string,
    icon?: Component,
    textClass?: string
}>();

</script>

<style scoped></style>