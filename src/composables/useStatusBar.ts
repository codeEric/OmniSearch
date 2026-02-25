import { ResultType, ViewType } from "@/utilities/types";
import { computed } from "vue";
import type { Ref } from "vue";

export function useStatusBar(
    filteredResults: Ref<any[]>,
    selectedIndex: Ref<number>,
    isMathExpression: Ref<boolean>,
    currentView: Ref<ViewType>,
) {
    const selectKeyText = computed(() => {
        if (isMathExpression.value) {
            return "Copy answer";
        }

        const item = filteredResults.value?.[selectedIndex.value];

        if (!item) {
            return "Select";
        }

        const openTypes = [
            ResultType.History,
            ResultType.Search,
            ResultType.Bookmark,
            ResultType.Command,
        ];

        if (openTypes.includes(item.type)) {
            return "Open";
        }

        return "Select";
    });

    const selectKeyModText = computed(() => {
        const item = filteredResults.value?.[selectedIndex.value];

        if (!item) {
            return null;
        }

        const openTypes = [
            ResultType.History,
            ResultType.Search,
            ResultType.Bookmark,
            ResultType.Command,
        ];

        if (openTypes.includes(item.type)) {
            return "Open in a new tab";
        }

        return null;
    });

    const escapeKeyText = computed(() => {
        if (currentView.value !== ViewType.Default) return "Back";
        return "Close";
    });

    return { selectKeyText, selectKeyModText, escapeKeyText };
}
