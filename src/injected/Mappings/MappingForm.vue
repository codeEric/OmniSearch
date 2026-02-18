<template>
    <div class="create-mapping-container">
        <Toggle v-if="newMapping" id="useCurrentPage" label="Use Current Page" :model-value="useCurrentPage"
            @update:model-value="onUseCurrentPageChange" />
        <Input id="url" label="Url" :modelValue="form.url" @update:modelValue="val => update('url', val)" />
        <Input id="title" label="Title" :modelValue="form.title" @update:modelValue="val => update('title', val)" />
        <TagInput id="keyword" label="Keywords" :modelValue="form.keywords"
            @update:modelValue="val => update('keywords', val)" />
        <div>
            <ParametersTable :parameters="form.parameters" @addNewParameter="addParameter" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Input from '@/components/Input.vue';
import Toggle from '@/components/Toggle.vue';
import type { ResultParameter } from '@/utilities/types';
import { onMounted, ref, watch } from 'vue';
import ParametersTable from './ParametersTable.vue';
import TagInput from '@/components/TagInput.vue';

const props = defineProps<{
    newMapping: boolean,
    modelValue: {
        url: string,
        title: string,
        keywords: string[],
        parameters: ResultParameter[]
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void
    (e: 'addNewParameter'): void
}>();


const form = ref({ ...props.modelValue });

watch(() => props.modelValue, (newVal) => {
    form.value = { ...newVal };
    console.log(form);
}, { deep: true });


const useCurrentPage = ref(true);
const oldUrlValue = ref(form.value.url);

function update<K extends keyof typeof props.modelValue>(
    key: K,
    value: typeof props.modelValue[K]
) {
    form.value[key] = value;
    emit('update:modelValue', { ...form.value });
}

onMounted(() => {
    if (props.newMapping && useCurrentPage.value) {
        update('url', window.location.href)
    }
});

const onUseCurrentPageChange = (newValue: boolean) => {
    useCurrentPage.value = newValue;
    if (newValue) {
        oldUrlValue.value = form.value.url;
    }
    update('url', newValue ? window.location.href : oldUrlValue.value)
}

const addParameter = () => {
    emit('addNewParameter');
};

const editParameter = (parameter: ResultParameter) => {

};

const deleteParameter = (parameter: ResultParameter) => {

};



</script>

<style scoped></style>