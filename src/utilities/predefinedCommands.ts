import { useChromeSyncStorage } from "@/composables";
import { PredefinedCommandType, type SpecialMapping } from "./types";

export const predefinedCommands: SpecialMapping[] = [
    {
        keywords: ["!bookmark", "!bookmarks", "!bm", "!bms", "!bk"],
        action: () => {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    { command: "GET_BOOKMARKS" },
                    (response) => {
                        resolve({
                            type: PredefinedCommandType.Bookmarks,
                            data: response,
                        });
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
                        resolve({
                            type: PredefinedCommandType.TabGroups,
                            data: response,
                        });
                    },
                );
            });
        },
    },
    {
        keywords: ["!add", "!new", "!create"],
        action: async () => {
            return new Promise((resolve) => {
                resolve({
                    type: PredefinedCommandType.AddMapping,
                    data: null,
                });
            });
        },
    },
    {
        keywords: ["!mappings", "!mapping", "!maps", "!map"],
        action: async () => {
            const { init, mappings } = useChromeSyncStorage();
            await init();
            return new Promise((resolve) => {
                resolve({
                    type: PredefinedCommandType.Mappings,
                    data: mappings.value,
                });
            });
        },
    },
];
