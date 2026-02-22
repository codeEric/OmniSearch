<template>
    <div class="card-item">
        <div class="card-item-content">
            <div class="card-item-left">
                <FolderIcon :color="color" :size="24" />
                <span class="card-item-text">
                    {{ title }}
                </span>
            </div>
            <div class="card-item-right">
                <span class="card-item-type-card">
                    {{ type }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FolderIcon from '@/components/icons/FolderIcon.vue';
import type { ResultType } from '@/utilities';

const props = defineProps<{
    color: string,
    title: string,
    type: ResultType
}>();


</script>

<style scoped></style>