import { computed, ref, type Ref } from "vue";
import {
    ResultType,
    type Result,
    type ChromeTabGroup,
} from "@/utilities/types";

export function useTabGroupSearch(
    tabGroups: Ref<ChromeTabGroup[]>,
    searchQuery: Ref<string>,
) {
    const selectedIndex = ref(0);

    const filteredResults = computed<Result[]>(() => {
        selectedIndex.value = 0;

        const query = searchQuery.value.trim().toLowerCase();

        if (!query) {
            return tabGroups.value.slice(0, 6).map(mapGroupToResult);
        }

        const results: Result[] = [];

        for (const group of tabGroups.value) {
            const groupTitle = group.title?.toLowerCase() ?? "";

            if (groupTitle.includes(query)) {
                results.push(mapGroupToResult(group));
                continue;
            }

            const matchingTabs = group.tabs.filter((tab) => {
                const tabTitle = tab.title?.toLowerCase() ?? "";
                const tabUrl = tab.url?.toLowerCase() ?? "";

                return tabTitle.includes(query) || tabUrl.includes(query);
            });

            if (matchingTabs.length > 0) {
                results.push({
                    id: group.id,
                    title: group.title,
                    type: ResultType.TabGroup,
                    color: group.color,
                    tabs: matchingTabs.map((tab) => ({
                        id: tab.id ?? crypto.randomUUID(),
                        title: tab.title ?? "Untitled",
                        icon: tab.favIconUrl,
                        url: tab.url,
                        type: ResultType.Tab,
                    })),
                });
            }
        }

        return results.slice(0, 6);
    });

    return {
        filteredResults,
        selectedIndex,
    };
}

function mapGroupToResult(group: ChromeTabGroup): Result {
    return {
        id: group.id,
        title: group.title,
        type: ResultType.TabGroup,
        color: group.color,
        tabs: group.tabs.map((tab) => ({
            id: tab.id ?? crypto.randomUUID(),
            title: tab.title ?? "Untitled",
            icon: tab.favIconUrl,
            url: tab.url,
            type: ResultType.Tab,
        })),
    };
}
