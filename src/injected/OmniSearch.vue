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
        :escapeKey="escapeKeyText" :showModKey="filteredResults[selectedIndex]?.type !== ResultType.Tab" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRef, watch } from "vue";
import SearchBar from "./SearchBar/SearchBar.vue";
import SearchResults from "./Results/SearchResults.vue";
import SearchStatusBar from "./StatusBar/SearchStatusBar.vue";
import { GroupType, ResultType, ViewType, type ChromeTab, type Result } from "../utilities/types";
import { clearReactive } from "../utilities/helpers";
import { useBookmarks, useBookmarkSearch, useChromeSyncStorage, useHistoryItemsSearch, useKeyboardHandler, useMathExpressions, useOmniSearch, useStatusBar, useTabGroups, useTabGroupSearch, useTabSearch } from "../composables";

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
const { bookmarks, fetchBookmarks } = useBookmarks();
const { tabGroups, fetchTabGroups } = useTabGroups();
const { filteredBookmarks } = useBookmarkSearch(bookmarks, searchQuery);
const { filteredTabs } = useTabSearch(toRef(props, 'tabs'), searchQuery);
const { filteredTabGroups } = useTabGroupSearch(tabGroups, searchQuery);
const { filteredResults, selectedIndex } = useOmniSearch(filteredTabs, filteredBookmarks, filteredTabGroups, mappings, searchQuery, currentGroupMode);

onMounted(() => {
    fetchBookmarks();
    fetchTabGroups();
});

watch(currentGroupMode, (mode) => {
    if (mode === GroupType.Bookmarks) {
        fetchBookmarks();
    }

    if (mode === GroupType.TabGroups) {
        fetchTabGroups();
    }
}, { immediate: true });

const availableGroupModes = computed(() => {
    const groups = [GroupType.Tabs];

    if (bookmarks.value?.length) {
        groups.push(GroupType.Bookmarks);
    }

    if (tabGroups.value?.length) {
        groups.push(GroupType.TabGroups);
    }

    return groups;
});

useKeyboardHandler({
    focusedInput,
    searchQuery,
    selectedIndex,
    filteredResults,
    isMathExpression,
    calculatedResult,
    parametersQuery,
    currentView,
    currentGroupMode,
    availableGroupModes
});

const { selectKeyText, selectKeyModText, escapeKeyText } = useStatusBar(filteredResults, selectedIndex, isMathExpression, currentView);

const updateParametersQuery = (key: string, value: string) => {
    parametersQuery[key] = value;
}

</script>

<style scoped></style>