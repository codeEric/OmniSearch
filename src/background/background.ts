import type { ChromeTab } from "../utilities/types";
import { useChromeSyncStorage } from "../composables/useChromeStorage";

let showOmniSearch = false;
let tabsCache: chrome.tabs.Tab[] = [];

const storage = useChromeSyncStorage();

storage.init();

const openOmniSearch = async () => {
    const tabs = (await chrome.tabs.query({ currentWindow: true })).map(
        (tab) => ({
            id: tab.id,
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
            await chrome.tabs.sendMessage(tab.id, {
                command: showOmniSearch
                    ? "SHOW_OMNI_SEARCH"
                    : "HIDE_OMNI_SEARCH",
                data: tabs,
            });
        } catch (e: unknown) {}
    }
};

function updateTabsCache() {
    chrome.tabs.query({}, (tabs) => {
        tabsCache = tabs;
        broadcastTabs();
    });
}

async function broadcastTabs() {
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
}

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
    if (message.command === "update_user_preferences") {
        chrome.storage.sync.set({
            ss_userPreferences: message.payload,
        });
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
