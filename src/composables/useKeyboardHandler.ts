import { clearReactive } from "@/utilities/helpers";
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
                        "*"
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
                        calculatedResult.value as string
                    );
                    window.postMessage(
                        {
                            type: "FROM_TAB_FILTER",
                            command: "HIDE_OMNI_SEARCH",
                        },
                        "*"
                    );
                }
                if (
                    filteredResults.value[selectedIndex.value].type ===
                    ResultType.Tab
                ) {
                    window.postMessage(
                        {
                            type: "FROM_TAB_FILTER",
                            command: "OPEN_SELECTED_TAB",
                            tabId: filteredResults.value[selectedIndex.value]
                                .id,
                        },
                        "*"
                    );
                }

                if (
                    filteredResults.value[selectedIndex.value].type ===
                    ResultType.Command
                ) {
                    window.open(
                        buildCommandUrl(
                            filteredResults.value[
                                selectedIndex.value
                            ] as CommandResult,
                            parametersQuery
                        )
                    );
                    clearReactive(parametersQuery);
                }

                if (
                    filteredResults.value[selectedIndex.value].type ===
                    ResultType.Search
                ) {
                    window.open(filteredResults.value[selectedIndex.value].url);
                }
                break;
            case "Tab":
                e.preventDefault();
                if (
                    filteredResults.value[selectedIndex.value].type ===
                    ResultType.Command
                ) {
                    focusedInput.value =
                        (focusedInput.value + 1) %
                        ((
                            filteredResults.value[
                                selectedIndex.value
                            ] as CommandResult
                        ).parameters.length +
                            1);
                    break;
                }
        }
    };

    onMounted(() => window.addEventListener("keydown", handler, true));
    onUnmounted(() => window.removeEventListener("keydown", handler, true));

    return { handler };
};
