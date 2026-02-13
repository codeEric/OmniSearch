<template>
    <div class="toggle-container">
        <label :for="id" class="toggle-label">
            {{ label }}
        </label>
        <label class="toggle" :class="{ mounted }">
            <input type="checkbox" :id="id" class="toggle-input" v-model="model" role="switch"
                :aria-checked="modelValue" />
            <span class="toggle-thumb"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const mounted = ref(false);

const props = defineProps<{
    id: string,
    label: string,
    modelValue: boolean
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const model = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value)
})

onMounted(() => {
    mounted.value = true;
});

</script>

<style scoped></style>