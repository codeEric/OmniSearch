import { computed, ref, type Ref } from "vue";
import {
    ResultType,
    type Result,
    type ChromeTab,
    type TabResult,
} from "@/utilities/types";

export function useTabSearch(tabs: Ref<ChromeTab[]>, searchQuery: Ref<string>) {
    const selectedIndex = ref(0);

    const filteredTabs = computed<TabResult[]>(() => {
        selectedIndex.value = 0;

        const query = searchQuery.value.toLowerCase();

        const filtered = query
            ? tabs.value.filter(
                  (tab) =>
                      tab.title?.toLowerCase().includes(query) ||
                      tab.url?.toLowerCase().includes(query),
              )
            : tabs.value;

        return filtered.map((tab) => ({
            id: tab.id ?? crypto.randomUUID(),
            title: tab.title ?? "Untitled",
            type: ResultType.Tab,
            icon: `https://www.google.com/s2/favicons?domain=${new URL(tab.url ?? "").hostname}&sz=128`,
            url: tab.url ?? "",
        }));
    });

    return {
        filteredTabs,
    };
}
