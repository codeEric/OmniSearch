import { initializeShadowHost } from "../utilities";
import { mountVueComponent } from "../utilities";
import OmniSearchCard from "../injected/OmniSearchCard.vue";
import type { TabFilterCommand, TabFilterMessage } from "@/utilities/types";

let toggleComponent: ((visible: boolean, data: any) => void) | null = null;
let updateTabs: ((updatedTabs?: any) => void) | null = null;
let shadowHostElement: HTMLElement | null = null;

async function setup() {
    if (shadowHostElement) return;

    const { shadowHost, rootContainer } = await initializeShadowHost();
    shadowHostElement = shadowHost;

    const controller = mountVueComponent(rootContainer, OmniSearchCard);
    toggleComponent = controller.toggleComponent;
    updateTabs = controller.updateTabs;

    shadowHostElement.style.display = "none";
    document.body.appendChild(shadowHostElement);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "SHOW_OMNI_SEARCH") {
        if (!toggleComponent) {
            setup().then(() => {
                shadowHostElement!.style.display = "block";
                toggleComponent?.(true, message.data);
            });
        } else {
            shadowHostElement!.style.display = "block";
            toggleComponent(true, message.data);
        }
    }
    if (message.command == "TABS_UPDATED") {
        updateTabs?.(message.data);
    }
    return true;
});

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (!event.data || event.data.type !== "FROM_TAB_FILTER") return;
    if (!toggleComponent || !shadowHostElement) return;

    const { command, tabId } = event.data as TabFilterMessage;

    const closeOmniSearch = () => {
        if (!toggleComponent || !shadowHostElement) return;
        shadowHostElement.style.display = "none";
        toggleComponent(false, null);
    };

    const handlers: Record<TabFilterCommand, () => void> = {
        HIDE_OMNI_SEARCH: () => {
            closeOmniSearch();
            chrome.runtime.sendMessage({ command });
        },

        OPEN_SELECTED_TAB: () => {
            closeOmniSearch();
            chrome.runtime.sendMessage({ command, tabId });
        },
    };

    if (handlers[command]) {
        handlers[command]();
    }
});

chrome.storage.sync.get("ss_userPreferences", ({ ss_userPreferences }) => {
    if (ss_userPreferences?.enabled) {
        setup();
    }
});
