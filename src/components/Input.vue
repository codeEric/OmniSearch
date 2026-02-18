<template>
    <div class="input-container">
        <label :for="id" class="input-label">
            {{ label }}
        </label>
        <input type="text" :id="id" class="input-field" v-model="model" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
    id: string,
    label: string,
    modelValue: string
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const model = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
})

</script>

<style scoped></style>