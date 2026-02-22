import { chromeSendMessage, getHexFromColorName } from "@/utilities/helpers";
import {
    ResultType,
    type ChromeBookmark,
    type ChromeTabGroup,
    type ChromeTabWithGroup,
} from "@/utilities/types";
import { ref } from "vue";

export function useTabGroups() {
    const tabGroups = ref<ChromeTabWithGroup[]>([]);

    const fetchTabGroups = async () => {
        const chromeTabGroups: {
            tabGroups: chrome.tabGroups.TabGroup[];
            tabs: chrome.tabs.Tab[];
        } = await chromeSendMessage("GET_TAB_GROUPS");

        const mappedTabs = chromeTabGroups.tabs.map((tab) => {
            const group = chromeTabGroups.tabGroups.find(
                (g) => g.id === tab.groupId,
            );
            return {
                id: tab.id?.toString() ?? crypto.randomUUID(),
                title: tab.title ?? "Untitled",
                favIconUrl: tab.url
                    ? `https://www.google.com/s2/favicons?domain=${
                          new URL(tab.url).hostname
                      }&sz=128`
                    : "",
                url: tab.url,
                group: group
                    ? {
                          id: group.id.toString(),
                          title: group.title ?? "Untitled",
                          color: getHexFromColorName(group.color),
                      }
                    : undefined,
            };
        });

        tabGroups.value = mappedTabs;
    };

    return {
        tabGroups,
        fetchTabGroups,
    };
}
