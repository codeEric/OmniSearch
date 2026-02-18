<template>
    <SearchBar :modelValue="searchQuery" @update:modelValue="emit('update:searchQuery', $event)"
        :selectedResult="filteredResults[selectedIndex]" :parametersQuery="parametersQuery"
        @update:parametersQuery="updateParametersQuery" @clear:parametersQuery="clearReactive(parametersQuery)"
        :focusedInput="focusedInput" :currentCommandInAction="currentCommandInAction"
        :currentGroupMode="currentGroupMode" />
    <hr class="separator" />
    <SearchResults :isMathExpression="isMathExpression" :mathExpression="searchQuery"
        :mathExpressionResult="calculatedResult ?? ''" :results="filteredResults"
        :selectedResultIndex="selectedIndex" />
</template>

<script setup lang="ts">
import SearchBar from '../SearchBar/SearchBar.vue';
import SearchResults from '../Results/SearchResults.vue';
import type { ChromeTab, GroupType, Result, SpecialMapping } from '@/utilities/types';
import { clearReactive } from '@/utilities/helpers';

const props = defineProps<{
    tabs: ChromeTab[],
    searchQuery: string,
    parametersQuery: Record<string, string>,
    focusedInput: number,
    isMathExpression: boolean,
    calculatedResult: string | number | null,
    filteredResults: Result[],
    selectedIndex: number,
    currentCommandInAction: SpecialMapping | null
    currentGroupMode: GroupType
}>();

const emit = defineEmits<{
    (e: 'update:searchQuery', value: string): void,
    (e: 'update:parametersQuery', value: Record<string, string>): void,
    (e: 'clear:parametersQuery'): void
}>();

const updateParametersQuery = (key: string, value: string) => {
    props.parametersQuery[key] = value;
}

</script>

<style scoped></style>