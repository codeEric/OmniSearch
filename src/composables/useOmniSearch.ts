import { predefinedCommands } from "@/utilities/predefinedCommands";
import { isBookmarkArray, isTabGroupArray } from "@/utilities/typeGuards";
import {
    ResultType,
    type ChromeBookmark,
    type ChromeTab,
    type ChromeTabGroup,
    type Mapping,
    type Result,
    type SpecialMapping,
} from "@/utilities/types";
import { ref, watchEffect, type Ref } from "vue";

export function useOmniSearch(
    tabs: Ref<ChromeTab[]>,
    mappings: Ref<Mapping[]>,
    searchQuery: Ref<string>,
) {
    const selectedIndex = ref(0);
    const filteredResults = ref<Result[]>([]);
    const predefinedCommandResults = ref<Result[]>([]);
    const currentCommandInAction = ref<SpecialMapping | null>(null);

    watchEffect(async () => {
        selectedIndex.value = 0;

        const query = searchQuery.value.toLowerCase();
        let chromeTabs: ChromeTab[] = [];
        let additionalTabs: Result[] = [];

        if (query) {
            if (isPredefinedCommands(query)) {
                if (!predefinedCommandResults.value.length) {
                    predefinedCommandResults.value =
                        await getPredinedCommandResults(query);
                }

                filteredResults.value = predefinedCommandResults.value
                    .filter(
                        (result) =>
                            result.title
                                .toLowerCase()
                                .includes(
                                    currentCommandInAction.value?.filterQuery ??
                                        "",
                                ) ||
                            (result?.url &&
                                result?.url
                                    .toLowerCase()
                                    .includes(
                                        currentCommandInAction.value
                                            ?.filterQuery ?? "",
                                    )),
                    )
                    .slice(0, 6);
                return;
            }
            if (currentCommandInAction.value) {
                predefinedCommandResults.value = [];
                currentCommandInAction.value = null;
            }

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

    const isPredefinedCommands = (query: string) => {
        const normalizedQuery = query.trim();

        return predefinedCommands.some((command) =>
            command.keywords.some((keyword) => keyword === normalizedQuery),
        );
    };

    const getPredinedCommandResults = async (query: string) => {
        const normalizedQuery = query.trim();

        for (const command of predefinedCommands) {
            if (
                command.keywords.some((keyword) => keyword === normalizedQuery)
            ) {
                currentCommandInAction.value = command;
                const results = await command.action();
                if (!results || results.length === 0) return [];
                if (isTabGroupArray(results)) {
                    const mapped: ChromeTabGroup[] = results.map((group) => ({
                        id: group.id.toString(),
                        title: group.title || "Untitled Group",
                        color: getHexFromColorName(group.color),
                        type: ResultType.PredefinedCommand,
                        url: null,
                    }));
                    return mapped;
                } else if (isBookmarkArray(results)) {
                    const mapped: ChromeBookmark[] | undefined =
                        results[0]?.children?.[0].children?.map(
                            (bookmark: any) => ({
                                id: bookmark.id,
                                title: bookmark.title,
                                url: bookmark.url || "",
                                icon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark?.url ?? "").hostname}&sz=128`,
                                type: ResultType.PredefinedCommand,
                            }),
                        );
                    return mapped ?? [];
                } else {
                    return [];
                }
            }
        }
        return [];
    };

    const getHexFromColorName = (
        colorName: chrome.tabGroups.TabGroup["color"],
    ): string => {
        const colorMap: Record<chrome.tabGroups.TabGroup["color"], string> = {
            grey: "#dadce0",
            blue: "#89b5f8",
            red: "#f28b82",
            yellow: "#fdd663",
            green: "#80c995",
            pink: "#ff8acb",
            purple: "#c68af9",
            cyan: "#77d9ec",
            orange: "#fcad6f",
        };

        return colorMap[colorName] || "#000000";
    };

    return {
        filteredResults,
        selectedIndex,
        currentCommandInAction,
    };
}
