import { useChromeSyncStorage } from "@/composables";
import type { SpecialMapping } from "./types";

export const predefinedCommands: SpecialMapping[] = [
    {
        keywords: ["!bookmark", "!bookmarks", "!bm", "!bms", "!bk"],
        action: () => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    { command: "GET_BOOKMARKS" },
                    (response) => {
                        resolve({ type: "bookmarks", data: response });
                    },
                );
            });
        },
    },
    {
        keywords: [
            "!tabgroups",
            "!tabgrooup",
            "!tg",
            "!tgs",
            "!tgroup",
            "!tgroups",
        ],
        action: () => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    { command: "GET_TAB_GROUPS" },
                    (response) => {
                        resolve({ type: "tabgroups", data: response });
                    },
                );
            });
        },
    },
    {
        keywords: ["!add", "!new", "!create"],
        action: async () => {
            return new Promise((resolve) => {});
        },
    },
    {
        keywords: ["!mappings", "!mapping", "!maps", "!map"],
        action: async () => {
            const { init, mappings } = useChromeSyncStorage();
            await init();
            return new Promise((resolve) => {
                resolve({ type: "mappings", data: mappings.value });
            });
        },
    },
];
