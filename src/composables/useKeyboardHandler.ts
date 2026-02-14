import { clearReactive } from "@/utilities/helpers";
import { isChromeTabGroup } from "@/utilities/typeGuards";
import { ResultType, type CommandResult } from "@/utilities/types";
import { buildCommandUrl } from "@/utilities/urlHelpers";
import { onMounted, onUnmounted, type Ref } from "vue";

interface HandlerDeps {
    focusedInput: Ref<number>;
    searchQuery: Ref<string>;
    selectedIndex: Ref<number>;
    filteredResults: Ref<any[]>;
    isMathExpression: Ref<boolean>;
    calculatedResult: Ref<unknown>;
    parametersQuery: any; // Reactive object
}

export const useKeyboardHandler = (deps: HandlerDeps) => {
    const {
        focusedInput,
        searchQuery,
        selectedIndex,
        filteredResults,
        isMathExpression,
        calculatedResult,
        parametersQuery,
    } = deps;

    const handler = (e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        const selectedResult = filteredResults.value[selectedIndex.value];
        switch (e.key) {
            case "Backspace":
                if (
                    focusedInput.value > 0 &&
                    parametersQuery[
                        Object.keys(parametersQuery)[focusedInput.value - 1]
                    ] === ""
                ) {
                    focusedInput.value = focusedInput.value - 1;
                    e.preventDefault();
                }
                break;
            case "Escape":
                if (!searchQuery.value) {
                    window.postMessage(
                        {
                            type: "FROM_TAB_FILTER",
                            command: "HIDE_OMNI_SEARCH",
                        },
                        "*",
                    );
                } else {
                    searchQuery.value = "";
                    clearReactive(parametersQuery);
                }
                break;
            case "ArrowDown":
                if (!isMathExpression.value) {
                    selectedIndex.value =
                        selectedIndex.value >= filteredResults.value.length - 1
                            ? 0
                            : selectedIndex.value + 1;
                } else {
                    selectedIndex.value =
                        selectedIndex.value >= filteredResults.value.length
                            ? 0
                            : selectedIndex.value + 1;
                }
                break;
            case "ArrowUp":
                if (!isMathExpression.value) {
                    selectedIndex.value =
                        selectedIndex.value <= 0
                            ? filteredResults.value.length - 1
                            : selectedIndex.value - 1;
                } else {
                    selectedIndex.value =
                        selectedIndex.value <= 0
                            ? filteredResults.value.length
                            : selectedIndex.value - 1;
                }
                break;
            case "Enter":
                if (isMathExpression.value && calculatedResult.value) {
                    navigator.clipboard.writeText(
                        calculatedResult.value as string,
                    );
                    window.postMessage(
                        {
                            type: "FROM_TAB_FILTER",
                            command: "HIDE_OMNI_SEARCH",
                        },
                        "*",
                    );
                }
                if (selectedResult.type === ResultType.Tab) {
                    window.postMessage(
                        {
                            type: "FROM_TAB_FILTER",
                            command: "OPEN_SELECTED_TAB",
                            tabId: selectedResult.id,
                        },
                        "*",
                    );
                }

                if (selectedResult.type === ResultType.Command) {
                    window.open(
                        buildCommandUrl(
                            selectedResult as CommandResult,
                            parametersQuery,
                        ),
                    );
                    clearReactive(parametersQuery);
                }

                if (selectedResult.type === ResultType.Search) {
                    window.open(selectedResult.url);
                }
                if (isChromeTabGroup(selectedResult)) {
                    chrome.runtime.sendMessage({
                        command: "TOGGLE_TAB_GROUP",
                        tabGroupId: selectedResult.id,
                    });
                }

                break;
            case "Tab":
                e.preventDefault();
                if (selectedResult.type === ResultType.Command) {
                    focusedInput.value =
                        (focusedInput.value + 1) %
                        ((
                            filteredResults.value[
                                selectedIndex.value
                            ] as CommandResult
                        ).parameters.length +
                            1);
                } else if (
                    selectedResult.type === ResultType.PredefinedCommand
                ) {
                    focusedInput.value = (focusedInput.value + 1) % 2;
                }
                break;
        }
    };

    onMounted(() => window.addEventListener("keydown", handler, true));
    onUnmounted(() => window.removeEventListener("keydown", handler, true));

    return { handler };
};
