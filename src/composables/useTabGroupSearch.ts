import { computed, ref, type Ref, watch } from "vue";
import {
    ResultType,
    type Result,
    type ChromeTabWithGroup,
    type TabGroupResult,
    type ChromeTabGroup,
} from "@/utilities/types";

export function useTabGroupSearch(
    tabs: Ref<ChromeTabWithGroup[]>,
    searchQuery: Ref<string>,
) {
    const selectedIndex = ref(0);

    watch(searchQuery, () => {
        selectedIndex.value = 0;
    });

    const filteredResults = computed<Result[]>(() => {
        const query = searchQuery.value.trim().toLowerCase();

        if (!query) {
            return tabs.value
                .filter((tab) => tab.group)
                .map((tab) => ({
                    id: tab.id ?? crypto.randomUUID(),
                    title: tab.title ?? "Untitled",
                    icon: tab.favIconUrl,
                    url: tab.url,
                    type: ResultType.TabGroup,
                    group: tab.group!,
                }));
        }

        const results: Result[] = [];
        const addedGroupIds = new Set<string>();

        for (const tab of tabs.value) {
            const tabTitle = tab.title?.toLowerCase() ?? "";
            const tabUrl = tab.url?.toLowerCase() ?? "";
            const groupTitle = tab.group?.title?.toLowerCase() ?? "";

            if (
                tab.group &&
                groupTitle.includes(query) &&
                !addedGroupIds.has(tab.group.id)
            ) {
                results.push({
                    id: tab.id ?? crypto.randomUUID(),
                    title: tab.title ?? "Untitled",
                    icon: tab.favIconUrl,
                    url: tab.url,
                    type: ResultType.TabGroup,
                    group: tab.group,
                });

                addedGroupIds.add(tab.group.id);
                continue;
            }

            if (tabTitle.includes(query) || tabUrl.includes(query)) {
                results.push({
                    id: tab.id ?? crypto.randomUUID(),
                    title: tab.title ?? "Untitled",
                    type: ResultType.Tab,
                    ...tab,
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

function mapGroupToResult(group: ChromeTabGroup): TabGroupResult {
    return {
        id: group.id,
        title: group.title,
        type: ResultType.TabGroup,
        group: group,
    };
}
