import type { ChromeTab } from "../utilities/types";
import { useChromeSyncStorage } from "../composables/useChromeStorage";

let showOmniSearch = false;
let tabsCache: chrome.tabs.Tab[] = [];

const storage = useChromeSyncStorage();

storage.init();

const openOmniSearch = async () => {
    const tabs = (await chrome.tabs.query({ currentWindow: true })).map(
        (tab) => ({
            id: tab.id?.toString(),
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
            active: tab.active,
        }),
    ) satisfies ChromeTab[];
    const [tab] = tabs.filter((tab) => tab.active);
    if (tab && tab.id) {
        try {
            showOmniSearch = !showOmniSearch;
            await chrome.tabs.sendMessage(Number(tab.id), {
                command: showOmniSearch
                    ? "SHOW_OMNI_SEARCH"
                    : "HIDE_OMNI_SEARCH",
                data: tabs,
            });
        } catch (e: unknown) {}
    }
};

const updateTabsCache = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        tabsCache = tabs;
        broadcastTabs();
    });
};

const broadcastTabs = async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    tabs.forEach((tab) => {
        if (tab?.id) {
            chrome.tabs
                .sendMessage(tab.id, {
                    command: "TABS_UPDATED",
                    data: tabsCache,
                })
                .catch(() => {});
        }
    });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "HIDE_OMNI_SEARCH") {
        showOmniSearch = false;
    }
    if (message.command === "OPEN_SELECTED_TAB") {
        showOmniSearch = false;
        if (message.tabId) {
            chrome.tabs.update(message.tabId, { active: true });
        }
    }
    if (message.command === "UPDATE_USER_PREFERENCES") {
        chrome.storage.sync.set({
            ss_userPreferences: message.payload,
        });
    }
    if (message.command === "GET_TAB_GROUPS") {
        chrome.tabGroups.query({}, (groups) => {
            groups.forEach((group) => {
                chrome.tabs.query({ groupId: group.id }, (tabs) => {
                    sendResponse({ tabGroups: groups, tabs: tabs });
                });
            });
        });

        return true;
    }

    if (message.command === "GET_BOOKMARKS") {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            sendResponse(bookmarkTreeNodes);
        });

        return true;
    }

    if (message.command === "TOGGLE_TAB_GROUP") {
        const groupId = Number(message.tabGroupId);

        chrome.tabGroups.get(groupId).then((group) => {
            return chrome.tabGroups.update(groupId, {
                collapsed: !group.collapsed,
            });
        });
    }

    if (message.command === "GET_HISTORY") {
        chrome.history.search(
            {
                text: message.query || "",
                startTime: 0,
                maxResults: 100,
            },
            (result) => {
                sendResponse(result);
            },
        );

        return true;
    }
});

chrome.commands.onCommand.addListener((command: string) => {
    switch (command) {
        case "OmniSearch":
            openOmniSearch();
            break;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        showOmniSearch = false;
    }
});

chrome.tabs.onCreated.addListener(updateTabsCache);
chrome.tabs.onRemoved.addListener(updateTabsCache);
chrome.tabs.onUpdated.addListener(updateTabsCache);
