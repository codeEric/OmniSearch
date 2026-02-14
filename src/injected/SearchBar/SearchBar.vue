<template>
    <div class="searchbar">
        <SearchIcon class="search-icon" :size="22" color="#364153" />
        <input class="searchbar-input" type="text" ref="searchBar" placeholder="Search" autocomplete="off"
            :class="{ 'full-width': selectedResult?.type !== ResultType.Command && currentCommandInAction === null }"
            :value="modelValue" @input="$emit('update:modelValue', ($event.target as any)!.value)" />
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
        <div v-else-if="currentCommandInAction" class="searchbar-param">
            <div class="searchbar-param-input-container">
                <input ref="inputRefs" placeholder="Query" type="text" class="searchbar-param-input"
                    :value="currentCommandInAction?.filterQuery ?? ''"
                    @input="currentCommandInAction.filterQuery = ($event.target as HTMLInputElement).value" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { SearchIcon } from '../../components/icons';
import { ResultType, type Result, type SpecialMapping } from '../../utilities/types';
import { isChromeTabGroup } from '@/utilities/typeGuards';
import FolderIcon from '@/components/icons/FolderIcon.vue';

const searchBar = useTemplateRef('searchBar');

const props = defineProps<{
    modelValue: string;
    selectedResult: Result;
    parametersQuery: any;
    focusedInput: number;
    currentCommandInAction: SpecialMapping | null;
}>();

const inputRefs = ref<HTMLElement[] | HTMLElement>([]);

const emit = defineEmits(['update:modelValue', 'update:parametersQuery', 'clear:parametersQuery', 'update:filterQuery'])

watch(props.selectedResult, () => {
    emit('clear:parametersQuery');
});

watch(() => props.focusedInput, (newValue) => {
    if (Array.isArray(inputRefs.value)) {
        inputRefs.value[newValue]?.focus();

    } else {
        if (newValue === 1) {
            inputRefs.value?.focus();
        } else {
            searchBar.value?.focus();
        }
    }
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