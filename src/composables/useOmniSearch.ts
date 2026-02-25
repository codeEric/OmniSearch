import {
    GroupType,
    ResultType,
    type BookmarkResult,
    type ChromeTab,
    type Mapping,
    type Result,
    type TabGroupResult,
    type TabResult,
} from "@/utilities/types";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { useHistoryItemsSearch } from "./useHistoryItemsSearch";

export function useOmniSearch(
    filteredTabs: ComputedRef<TabResult[]>,
    filteredBookmarks: ComputedRef<BookmarkResult[]>,
    filteredTabGroups: ComputedRef<TabGroupResult[]>,
    mappings: Ref<Mapping[]>,
    searchQuery: Ref<string>,
    currentGroupMode: Ref<GroupType>,
) {
    const selectedIndex = ref(0);

    const { historyItems, fetchHistoryItems } =
        useHistoryItemsSearch(searchQuery);

    const filteredResults = computed<Result[]>(() => {
        switch (currentGroupMode.value) {
            case GroupType.Tabs:
                const results = [
                    ...filteredTabs.value,
                    ...historyItems.value,
                ] as Result[];

                if (searchQuery.value) {
                    results.push(getGoogleSearch(searchQuery.value));
                }

                return results;
            case GroupType.Bookmarks:
                return filteredBookmarks.value;
            case GroupType.TabGroups:
                return filteredTabGroups.value;
            default:
                return [];
        }
    });

    watch(
        [searchQuery, currentGroupMode],
        () => {
            if (
                currentGroupMode.value === GroupType.Tabs &&
                searchQuery.value.length > 0
            ) {
                fetchHistoryItems();
            } else {
                historyItems.value = [];
            }
        },
        { immediate: true },
    );

    const getGoogleSearch = (query: string): Result => {
        return {
            id: crypto.randomUUID(),
            title: `${query} - Google Search`,
            icon: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
            type: ResultType.Search,
            url: `https://www.google.com/search?q=${query}`,
        };
    };

    return {
        filteredResults,
        selectedIndex,
    };
}
