import type { SpecialMapping } from "./types";

export const predefinedCommands: SpecialMapping[] = [
    {
        keywords: ["!bookmark", "!bookmarks", "!bm", "!bms", "!bk"],
        action: () => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    { command: "GET_BOOKMARKS" },
                    (response) => {
                        resolve(response);
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
                        resolve(response);
                    },
                );
            });
        },
    },
];
