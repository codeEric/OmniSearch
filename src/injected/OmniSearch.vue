<template>
    <DefaultView v-if="currentView === ViewType.Default" :tabs="tabs" :searchQuery="searchQuery"
        @update:searchQuery="searchQuery = $event" :parametersQuery="parametersQuery" :focusedInput="focusedInput"
        :filteredResults="filteredResults" :selectedIndex="selectedIndex"
        :currentCommandInAction="currentCommandInAction" :isMathExpression="isMathExpression"
        :calculatedResult="calculatedResult" />

    <MappingCreationView v-else-if="currentView === ViewType.MappingCreation" />

    <hr class="separator" />
    <SearchStatusBar :selectKey="selectKeyText" :selectKeyMod="selectKeyModText ?? selectKeyText"
        :escapeKey="escapeKeyText" />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import SearchStatusBar from "./StatusBar/SearchStatusBar.vue";
import { ViewType, type ChromeTab } from "../utilities/types";
import { useChromeSyncStorage, useKeyboardHandler, useMathExpressions, useOmniSearch, useStatusBar } from "../composables";
import DefaultView from "./Views/DefaultView.vue";
import MappingCreationView from "./Views/MappingCreationView.vue";

const props = defineProps<{
    tabs: ChromeTab[]
}>();
const searchQuery = ref('');
const parametersQuery = reactive<Record<string, string>>({});
const focusedInput = ref(0);
const currentView = ref<ViewType>(ViewType.Default);

const { isMathExpression, calculatedResult } = useMathExpressions(searchQuery);
const { mappings } = useChromeSyncStorage();
const { filteredResults, selectedIndex, currentCommandInAction } = useOmniSearch(computed(() => props.tabs), mappings, searchQuery);
const { selectKeyText, selectKeyModText, escapeKeyText } = useStatusBar(filteredResults, selectedIndex, isMathExpression, currentView);

useKeyboardHandler({
    focusedInput,
    searchQuery,
    selectedIndex,
    filteredResults,
    isMathExpression,
    calculatedResult,
    parametersQuery,
    currentView
});

</script>

<style scoped></style>