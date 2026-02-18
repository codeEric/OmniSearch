import {
    ResultType,
    type ChromeTab,
    type Mapping,
    type Result,
} from "@/utilities/types";
import { ref, watchEffect, type Ref } from "vue";

export function useOmniSearch(
    tabs: Ref<ChromeTab[]>,
    mappings: Ref<Mapping[]>,
    searchQuery: Ref<string>,
) {
    const selectedIndex = ref(0);
    const filteredResults = ref<Result[]>([]);

    watchEffect(async () => {
        selectedIndex.value = 0;

        const query = searchQuery.value.toLowerCase();
        let chromeTabs: ChromeTab[] = [];
        let additionalTabs: Result[] = [];

        if (query) {
            chromeTabs = tabs.value
                .filter(
                    (tab) =>
                        tab.title?.toLowerCase().includes(query) ||
                        tab.url?.toLowerCase().includes(query),
                )
                .slice(0, 6);

            additionalTabs = handleCommands(query);
        } else {
            chromeTabs = tabs.value.slice(0, 6);
        }

        const mappedChromeTabs = chromeTabs.map((tab) => ({
            id: tab?.id || crypto.randomUUID(),
            title: tab?.title || "Untitled",
            type: ResultType.Tab,
            icon: tab?.favIconUrl,
            url: tab?.url,
        })) as Result[];

        const combinedResults = [...mappedChromeTabs, ...additionalTabs];

        if (query) {
            const firstFiveResults = combinedResults.slice(0, 5);
            const googleSearchResult: Result = {
                id: crypto.randomUUID(),
                title: `Search Google for ${query}`,
                type: ResultType.Search,
                icon: "https://www.google.com/s2/favicons?domain=google.com&sz=128",
                url: `https://www.google.com/search?q=${query}`,
            };
            filteredResults.value = [...firstFiveResults, googleSearchResult];
        } else {
            filteredResults.value = combinedResults;
        }
    });

    const handleCommands = (query: string): Result[] => {
        const tabs: Result[] = [];

        // mappings.value?.forEach((mapping) => {
        //     for (let keyword of mapping.keywords) {
        //         if (query.trim().startsWith(keyword)) {
        //             tabs.push(mapping.tab);
        //             break;
        //         }
        //     }
        // });

        return tabs;
    };

    return {
        filteredResults,
        selectedIndex,
    };
}
