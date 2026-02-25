import { chromeSendMessage } from "@/utilities/helpers";
import {
    ResultType,
    type ChromeTab,
    type HistoryResult,
} from "@/utilities/types";
import { ref, type Ref } from "vue";

export function useHistoryItemsSearch(searchQuery: Ref<string>) {
    const historyItems = ref<HistoryResult[]>([]);

    const fetchHistoryItems = async () => {
        const chromeHistoryItems: chrome.history.HistoryItem[] =
            (await chromeSendMessage(
                "GET_HISTORY",
                "query",
                searchQuery.value,
            )) ?? [];

        console.log(chromeHistoryItems);

        const suggestions: HistoryResult[] = chromeHistoryItems
            .map((item) => {
                const url = new URL(item.url ?? "");
                const isRoot = url.pathname === "/" || url.pathname === "";

                let score =
                    (item.visitCount || 0) * 5 + (item.typedCount || 0) * 8;

                if (url.hostname.startsWith(searchQuery.value.toLowerCase())) {
                    score += 500;
                }
                if (!isRoot) {
                    score -= url.pathname.length;
                }

                if (isRoot) {
                    score += 200;
                }

                return {
                    score: score,
                    id: item.id,
                    title: item.title ?? "Untitled",
                    url: item.url ?? "",
                    icon: `https://www.google.com/s2/favicons?domain=${new URL(item.url ?? "").hostname}&sz=128`,
                    type: ResultType.History,
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .filter((item) => item.score >= 500)
            .map((item) => ({
                id: item.id,
                title: item.title ?? "Untitled",
                url: item.url ?? "",
                icon: `https://www.google.com/s2/favicons?domain=${new URL(item.url ?? "").hostname}&sz=128`,
                type: ResultType.History,
            }));

        historyItems.value = suggestions ?? [];
    };
    return {
        historyItems,
        fetchHistoryItems,
    };
}
