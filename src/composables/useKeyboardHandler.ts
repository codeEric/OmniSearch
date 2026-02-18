import {
    clearReactive,
    postWindowMessage,
    sendChromeMessage,
} from "@/utilities/helpers";
import { isChromeTabGroup, isPredefinedCommand } from "@/utilities/typeGuards";
import {
    PredefinedCommandType,
    ResultType,
    ViewType,
    type CommandResult,
    type Result,
} from "@/utilities/types";
import { buildCommandUrl } from "@/utilities/urlHelpers";
import { onMounted, onUnmounted, type ComputedRef, type Ref } from "vue";

interface HandlerDeps {
    focusedInput: Ref<number>;
    searchQuery: Ref<string>;
    selectedIndex: Ref<number>;
    filteredResults: Ref<Result[]>;
    isMathExpression: Ref<boolean>;
    calculatedResult: ComputedRef<number | string | null>;
    parametersQuery: Record<string, string>;
    currentView: Ref<ViewType>;
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
        currentView,
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
                if (currentView.value !== ViewType.Default) {
                    currentView.value = ViewType.Default;
                    return;
                }
                if (!searchQuery.value) {
                    postWindowMessage("FROM_TAB_FILTER", "HIDE_OMNI_SEARCH");
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
                        calculatedResult.value as unknown as string,
                    );
                    postWindowMessage("FROM_TAB_FILTER", "HIDE_OMNI_SEARCH");
                }

                switch (selectedResult.type) {
                    case ResultType.Tab:
                        postWindowMessage(
                            "FROM_TAB_FILTER",
                            "OPEN_SELECTED_TAB",
                            "tabId",
                            selectedResult.id,
                        );
                        break;
                    case ResultType.Command:
                        const commandUrl = buildCommandUrl(
                            selectedResult,
                            parametersQuery,
                        );
                        window.open(commandUrl);
                        clearReactive(parametersQuery);
                        break;
                    case ResultType.Search:
                        window.open(selectedResult.url);
                        break;
                    case ResultType.PredefinedCommand:
                        handleEnterKeyPredefinedCommand(selectedResult);
                        break;
                }

                break;
            case "Tab":
                handleTabKey(e, selectedResult);
                break;
        }
    };

    onMounted(() => window.addEventListener("keydown", handler, true));
    onUnmounted(() => window.removeEventListener("keydown", handler, true));

    const handleEnterKeyPredefinedCommand = (selectedResult: Result) => {
        if (!isPredefinedCommand(selectedResult)) return;
        if (currentView.value === ViewType.MappingCreation) return;
        switch (selectedResult.predefinedCommandType) {
            case PredefinedCommandType.TabGroups:
                sendChromeMessage(
                    "TOGGLE_TAB_GROUP",
                    "tabGroupId",
                    selectedResult.id,
                );
                break;
            case PredefinedCommandType.Mappings:
                currentView.value = ViewType.MappingCreation;
                break;
            case PredefinedCommandType.AddMapping:
                currentView.value = ViewType.MappingCreation;
                break;
            default:
                if (selectedResult.url) {
                    window.open(selectedResult.url);
                }
                break;
        }
    };

    const handleTabKey = (e: Event, selectedResult: Result) => {
        e.preventDefault();
        if (selectedResult.type === ResultType.Command) {
            focusedInput.value =
                (focusedInput.value + 1) %
                ((filteredResults.value[selectedIndex.value] as CommandResult)
                    .parameters.length +
                    1);
        } else if (selectedResult.type === ResultType.PredefinedCommand) {
            focusedInput.value = (focusedInput.value + 1) % 2;
        }
    };

    return { handler };
};
