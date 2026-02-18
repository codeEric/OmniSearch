<template>
    <div class="parameter-form-container">
        <Input id="name" label="Name" :modelValue="form.name" @update:modelValue="val => update('name', val)" />

        <Input id="default" label="Default" :modelValue="form.default ?? ''"
            @update:modelValue="val => update('default', val)" />

        <div class="radio-label-container">
            <span class="radio-label">Parameter Type</span>

            <div class="radio-group-container">
                <div class="radio-container">
                    <input id="queryType" class="radio-button" type="radio" name="parameterType"
                        :checked="form.type === ResultParameterType.Query"
                        @change="update('type', ResultParameterType.Query)" />
                    <div class="radio-tile">
                        <label for="queryType" class="radio-tile-label">
                            Query
                        </label>
                    </div>
                </div>

                <div class="radio-container">
                    <input id="replaceType" class="radio-button" type="radio" name="parameterType"
                        :checked="form.type === ResultParameterType.Replace"
                        @change="update('type', ResultParameterType.Replace)" />
                    <div class="radio-tile">
                        <label for="replaceType" class="radio-tile-label">
                            Replace
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <Input id="query" label="Query" :modelValue="form.query ?? ''"
            @update:modelValue="val => update('query', val)" />

        <Toggle id="isRequired" label="Required" :modelValue="form.required"
            @update:modelValue="val => update('required', val)" />

        <Button text="Save" @click="emit('save')" />
    </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';
import Toggle from '@/components/Toggle.vue';
import { ResultParameterType, type ResultParameter } from '@/utilities/types';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    modelValue: ResultParameter
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void
    (e: 'save'): void
}>();

const form = ref({ ...props.modelValue });

watch(() => props.modelValue, (newVal) => {
    form.value = { ...newVal };
}, { deep: true });

function update<K extends keyof ResultParameter>(
    key: K,
    value: ResultParameter[K]
) {
    form.value[key] = value;
    emit('update:modelValue', { ...form.value });
}



</script>

<style scoped></style>