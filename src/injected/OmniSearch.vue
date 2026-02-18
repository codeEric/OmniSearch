<template>
    <template v-if="currentView === ViewType.Default">
        <SearchBar v-model="searchQuery" :selectedResult="filteredResults[selectedIndex]"
            :parametersQuery="parametersQuery" @update:parametersQuery="updateParametersQuery"
            @clear:parametersQuery="clearReactive(parametersQuery)" :focusedInput="focusedInput"
            :currentGroupMode="currentGroupMode" />
        <hr class="separator" />
        <SearchResults :isMathExpression="isMathExpression" :mathExpression="searchQuery"
            :mathExpressionResult="calculatedResult ?? ''" :results="filteredResults"
            :selectedResultIndex="selectedIndex" />
    </template>
    <template v-else-if="currentView === ViewType.MappingCreation">

    </template>
    <template v-else-if="currentView === ViewType.MappingEdit">

    </template>
    <hr class="separator" />
    <SearchStatusBar :selectKey="selectKeyText" :selectKeyMod="selectKeyModText ?? selectKeyText"
        :escapeKey="escapeKeyText" />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SearchBar from "./SearchBar/SearchBar.vue";
import SearchResults from "./Results/SearchResults.vue";
import SearchStatusBar from "./StatusBar/SearchStatusBar.vue";
import { GroupType, ViewType, type ChromeTab } from "../utilities/types";
import { clearReactive } from "../utilities/helpers";
import { useChromeSyncStorage, useKeyboardHandler, useMathExpressions, useOmniSearch } from "../composables";
import { useStatusBar } from "@/composables/useStatusBar";

const props = defineProps<{
    tabs: ChromeTab[]
}>();
const searchQuery = ref('');
const parametersQuery = reactive<Record<string, string>>({});
const focusedInput = ref(0);
const currentView = ref<ViewType>(ViewType.Default);
const currentGroupMode = ref<GroupType>(GroupType.Tabs);

const { isMathExpression, calculatedResult } = useMathExpressions(searchQuery);
const { mappings } = useChromeSyncStorage();
const { filteredResults, selectedIndex } = useOmniSearch(computed(() => props.tabs), mappings, searchQuery);
useKeyboardHandler({
    focusedInput,
    searchQuery,
    selectedIndex,
    filteredResults,
    isMathExpression,
    calculatedResult,
    parametersQuery,
    currentView,
    currentGroupMode
});

const { selectKeyText, selectKeyModText, escapeKeyText } = useStatusBar(filteredResults, selectedIndex, isMathExpression, currentView);

const updateParametersQuery = (key: string, value: string) => {
    parametersQuery[key] = value;
}

</script>

<style scoped></style>