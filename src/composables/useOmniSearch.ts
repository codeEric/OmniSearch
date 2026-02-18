import { getHexFromColorName } from "@/utilities/helpers";
import { predefinedCommands } from "@/utilities/predefinedCommands";
import {
    PredefinedCommandType,
    ResultType,
    type ChromeTab,
    type Mapping,
    type PredefinedCommandResult,
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

        mappings.value?.forEach((mapping) => {
            for (let keyword of mapping.keywords) {
                if (query.trim().startsWith(keyword)) {
                    tabs.push(mapping.tab);
                    break;
                }
            }
        });

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
                const result = await command.action();
                if (!result || result.data?.length === 0) return [];

                switch (result.type) {
                    case PredefinedCommandType.Bookmarks:
                        return mapBookmarks(result.data, result.type);

                    case PredefinedCommandType.TabGroups:
                        return mapTabGroups(result.data, result.type);

                    case PredefinedCommandType.Mappings:
                        return mapMappings(result.data, result.type);
                    case PredefinedCommandType.AddMapping:
                        return [
                            {
                                id: crypto.randomUUID(),
                                title: "Create new mapping",
                                type: ResultType.PredefinedCommand,
                                cardName: "Mapping Creation",
                                predefinedCommandType: result.type,
                                url: null,
                            } satisfies PredefinedCommandResult,
                        ];
                }
            }
        }
        return [];
    };

    const mapBookmarks = (
        bookmarks: chrome.bookmarks.BookmarkTreeNode[],
        resultType: PredefinedCommandType,
    ) => {
        const mapped: PredefinedCommandResult[] | undefined =
            bookmarks[0]?.children?.[0].children?.map((bookmark: any) => ({
                id: bookmark.id,
                title: bookmark.title,
                url: bookmark.url || "",
                icon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark?.url ?? "").hostname}&sz=128`,
                type: ResultType.PredefinedCommand,
                cardName: "Bookmark",
                predefinedCommandType: resultType,
            }));
        return mapped ?? [];
    };

    const mapTabGroups = (
        tabGroups: chrome.tabGroups.TabGroup[],
        resultType: PredefinedCommandType,
    ) => {
        const mapped: PredefinedCommandResult[] = tabGroups.map((group) => ({
            id: group.id.toString(),
            title: group.title || "Untitled Group",
            color: getHexFromColorName(group.color),
            type: ResultType.PredefinedCommand,
            cardName: "Tab Group",
            url: null,
            predefinedCommandType: resultType,
        }));
        return mapped;
    };

    const mapMappings = (
        mappings: Mapping[],
        resultType: PredefinedCommandType,
    ) => {
        const mapped: PredefinedCommandResult[] = mappings.map((mapping) => ({
            ...mapping.tab,
            type: ResultType.PredefinedCommand,
            cardName: "Mapping Definition",
            predefinedCommandType: resultType,
        }));

        return mapped;
    };

    return {
        filteredResults,
        selectedIndex,
        currentCommandInAction,
    };
}
