<template>
    <SearchBar v-model="searchQuery" :selectedResult="filteredResults[selectedIndex]" :parametersQuery="parametersQuery"
        @update:parametersQuery="updateParametersQuery" @clear:parametersQuery="clearReactive(parametersQuery)"
        :focusedInput="focusedInput" :currentCommandInAction="currentCommandInAction" />
    <hr class="separator" />
    <SearchResults :isMathExpression="isMathExpression" :mathExpression="searchQuery"
        :mathExpressionResult="calculatedResult ?? ''" :results="filteredResults"
        :selectedResultIndex="selectedIndex" />
    <hr class="separator" />
    <SearchStatusBar :selectKey="selectKeyText" :selectKeyMod="selectKeyModText ?? selectKeyText" />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SearchBar from "./SearchBar/SearchBar.vue";
import SearchResults from "./Results/SearchResults.vue";
import SearchStatusBar from "./StatusBar/SearchStatusBar.vue";
import { ResultType, type ChromeTab } from "../utilities/types";
import { clearReactive } from "../utilities/helpers";
import { useChromeSyncStorage, useKeyboardHandler, useMathExpressions, useOmniSearch } from "../composables";

const props = defineProps<{
    tabs: ChromeTab[]
}>();
const searchQuery = ref('');
const parametersQuery = reactive<Record<string, string>>({});
const focusedInput = ref(0);

const selectKeyText = computed(() => {
    if (isMathExpression.value) return 'Copy answer';
    else if (filteredResults.value?.length > 0 && selectedIndex.value > -1 && filteredResults.value[selectedIndex.value].type === ResultType.Command) return 'Open';
    return 'Select';
});

const selectKeyModText = computed(() => {
    if (filteredResults.value?.length > 0 && selectedIndex.value > -1 && filteredResults.value[selectedIndex.value].type === ResultType.Command) return 'Open in new Tab';
    return null;
});

const { isMathExpression, calculatedResult } = useMathExpressions(searchQuery);
const { mappings } = useChromeSyncStorage();
const { filteredResults, selectedIndex, currentCommandInAction } = useOmniSearch(computed(() => props.tabs), mappings, searchQuery);
const { handler } = useKeyboardHandler({
    focusedInput,
    searchQuery,
    selectedIndex,
    filteredResults,
    isMathExpression,
    calculatedResult,
    parametersQuery
});

const updateParametersQuery = (key: string, value: string) => {
    parametersQuery[key] = value;
}

</script>

<style scoped></style>