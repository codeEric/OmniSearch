import { chromeSendMessage, getHexFromColorName } from "@/utilities/helpers";
import {
    ResultType,
    type ChromeBookmark,
    type ChromeTabGroup,
} from "@/utilities/types";
import { ref } from "vue";

export function useTabGroups() {
    const tabGroups = ref<ChromeTabGroup[]>([]);

    const fetchTabGroups = async () => {
        const chromeTabGroups: {
            tabGroups: chrome.tabGroups.TabGroup[];
            tabs: chrome.tabs.Tab[];
        } = await chromeSendMessage("GET_TAB_GROUPS");
        const mappedTabGroups: ChromeTabGroup[] | undefined =
            chromeTabGroups.tabGroups?.map(
                (tabGroup) =>
                    ({
                        id: tabGroup.id.toString(),
                        title: tabGroup.title ?? "Untitle",
                        color: getHexFromColorName(tabGroup.color),
                        tabs: chromeTabGroups.tabs
                            .filter((tab) => tab.groupId === tabGroup.id)
                            .map((tab) => ({
                                id: tab.id?.toString() ?? crypto.randomUUID(),
                                title: tab?.title ?? "Untitled",
                                favIconUrl: `https://www.google.com/s2/favicons?domain=${new URL(tab.url ?? "").hostname}&sz=128`,
                                url: tab.url,
                            })),
                    }) satisfies ChromeTabGroup,
            );

        tabGroups.value = mappedTabGroups ?? [];
    };
    return {
        tabGroups,
        fetchTabGroups,
    };
}
