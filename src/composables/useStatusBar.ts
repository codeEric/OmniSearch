import { ViewType } from "@/utilities/types";
import { computed } from "vue";
import type { Ref } from "vue";

export function useStatusBar(
    filteredResults: Ref<any[]>,
    selectedIndex: Ref<number>,
    isMathExpression: Ref<boolean>,
    currentView: Ref<ViewType>,
) {
    const selectKeyText = computed(() => {
        if (isMathExpression.value) return "Copy answer";
        // else if (
        //     filteredResults.value?.length > 0 &&
        //     selectedIndex.value > -1 &&
        //     filteredResults.value[selectedIndex.value].type === "Command"
        // )
        //     return "Open";
        return "Select";
    });

    const selectKeyModText = computed(() => {
        // if (
        //     filteredResults.value?.length > 0 &&
        //     selectedIndex.value > -1 &&
        //     filteredResults.value[selectedIndex.value].type === "Command"
        // )
        //     return "Open in new Tab";
        return null;
    });

    const escapeKeyText = computed(() => {
        if (currentView.value !== ViewType.Default) return "Back";
        return "Close";
    });

    return { selectKeyText, selectKeyModText, escapeKeyText };
}
