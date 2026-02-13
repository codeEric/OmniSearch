<template>
    <div class="searchbar">
        <SearchIcon class="search-icon" :size="22" color="#364153" />
        <input class="searchbar-input" type="text" ref="searchBar" placeholder="Search" autocomplete="off"
            :class="{ 'full-width': selectedResult?.type !== ResultType.Command }" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as any)!.value)" />
        <div v-if="selectedResult?.type === ResultType.Command" class="searchbar-param">
            <img :src="selectedResult?.icon" class="searchbar-param-icon" />

            <div class="searchbar-param-input-container" v-for="parameter in selectedResult.parameters"
                :key="parameter.name">
                <input ref="inputRefs" :placeholder="capitalizeFirstLetter(parameter.name)" type="text"
                    class="searchbar-param-input" :value="props.parametersQuery[parameter.name] ?? ''"
                    @input="emit('update:parametersQuery', parameter.name, ($event.target as HTMLInputElement).value)" />
                <span class="searchbar-param-default" v-if="parameter.default">{{ parameter.default }}</span>
                <span class="searchbar-param-default">{{ parameter.default }}</span>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { SearchIcon } from '../../components/icons';
import { ResultType, type Result } from '../../utilities/types';

const searchBar = useTemplateRef('searchBar');

const props = defineProps<{
    modelValue: string;
    selectedResult: Result;
    parametersQuery: any;
    focusedInput: number;
}>();

const inputRefs = ref<HTMLElement[]>([]);

const emit = defineEmits(['update:modelValue', 'update:parametersQuery', 'clear:parametersQuery'])

watch(props.selectedResult, () => {
    emit('clear:parametersQuery');
});

watch(() => props.focusedInput, (newValue) => {
    inputRefs.value[newValue]?.focus();
})

onMounted(() => {
    searchBar.value?.focus();
    if (searchBar.value) {
        inputRefs.value = [searchBar.value];
    }
})

const capitalizeFirstLetter = (value: string): string => {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

</script>

<style scoped></style>