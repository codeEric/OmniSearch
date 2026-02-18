<template>
    <div class="input-container">
        <label :for="id" class="input-label">
            {{ label }}
        </label>
        <div class="input-field tag-input-field">
            <span class="tag-input-card" v-for="tag of modelValue" :key="tag">
                {{ tag }}
                <CloseIcon :size="20" @click="() => removeTag(tag)" />
            </span>
            <input type="text" :id="id" class="tag-input" v-model="tag" @keypress.enter.prevent.stop="addTag" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CloseIcon from './icons/CloseIcon.vue';

const tag = ref<string>('');

const props = defineProps<{
    id: string,
    label: string,
    modelValue: string[]
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
}>()

const addTag = (ev: Event) => {
    if (!tag.value) {
        return;
    }
    if (props.modelValue.includes(tag.value)) {
        tag.value = '';
        return;
    }
    emit('update:modelValue', [...props.modelValue, tag.value]);
    console.log(props.modelValue);

    tag.value = '';
}

const removeTag = (tag: string) => {
    emit('update:modelValue', [...props.modelValue].filter(t => t !== tag));

}

</script>

<style scoped></style>