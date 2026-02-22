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
import { computed, reactive, ref, toRef, watch } from "vue";
import SearchBar from "./SearchBar/SearchBar.vue";
import SearchResults from "./Results/SearchResults.vue";
import SearchStatusBar from "./StatusBar/SearchStatusBar.vue";
import { GroupType, ViewType, type ChromeBookmark, type ChromeTab, type Result } from "../utilities/types";
import { clearReactive } from "../utilities/helpers";
import { useBookmarks, useBookmarkSearch, useChromeSyncStorage, useKeyboardHandler, useMathExpressions, useOmniSearch, useStatusBar, useTabGroups, useTabGroupSearch, useTabSearch } from "../composables";

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
const { selectedIndex } = useOmniSearch(computed(() => props.tabs), mappings, searchQuery);
const { bookmarks, fetchBookmarks } = useBookmarks();
const { tabGroups, fetchTabGroups } = useTabGroups();
const bookmarksSearch = useBookmarkSearch(bookmarks, searchQuery);
const tabsSearch = useTabSearch(toRef(props, 'tabs'), searchQuery);
const tabGroupSearch = useTabGroupSearch(tabGroups, searchQuery);

watch(currentGroupMode, (mode) => {
    if (mode === GroupType.Bookmarks) {
        fetchBookmarks();
    }

    if (mode === GroupType.TabGroups) {
        fetchTabGroups();
    }
}, { immediate: true });

const filteredResults = computed(() => {
    switch (currentGroupMode.value) {
        case GroupType.Tabs:
            return tabsSearch.filteredResults.value;
        case GroupType.Bookmarks:
            return bookmarksSearch.filteredResults.value
        case GroupType.TabGroups:
            return tabGroupSearch.filteredResults.value;
        default:
            return [];
    }
})


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