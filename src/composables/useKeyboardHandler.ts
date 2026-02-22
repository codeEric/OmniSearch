import { clearReactive, postWindowMessage } from "@/utilities/helpers";
import {
    GroupType,
    ResultType,
    ViewType,
    type CommandResult,
    type FlattenedResult,
    type Result,
} from "@/utilities/types";
import { buildCommandUrl } from "@/utilities/urlHelpers";
import {
    computed,
    onMounted,
    onUnmounted,
    type ComputedRef,
    type Ref,
} from "vue";

interface HandlerDeps {
    focusedInput: Ref<number>;
    searchQuery: Ref<string>;
    selectedIndex: Ref<number>;
    filteredResults: ComputedRef<Result[]>;
    isMathExpression: Ref<boolean>;
    calculatedResult: ComputedRef<number | string | null>;
    parametersQuery: Record<string, string>;
    currentView: Ref<ViewType>;
    currentGroupMode: Ref<GroupType>;
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
        currentGroupMode,
    } = deps;

    const handler = (e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        const selectedResult = filteredResults.value[selectedIndex.value];
        switch (e.key) {
            case "Backspace":
                handleBackspaceKey(e);
                break;
            case "Escape":
                handleEscapeKey();
                break;
            case "ArrowDown":
                handleArrowKeyDown();
                break;
            case "ArrowUp":
                handleArrowKeyUp();
                break;
            case "Enter":
                handleEnterKey(selectedResult);
                break;
            case "Tab":
                handleTabKey(e, selectedResult);
                break;
        }
    };

    onMounted(() => window.addEventListener("keydown", handler, true));
    onUnmounted(() => window.removeEventListener("keydown", handler, true));

    const handleBackspaceKey = (e: Event) => {
        if (
            focusedInput.value > 0 &&
            parametersQuery[
                Object.keys(parametersQuery)[focusedInput.value - 1]
            ] === ""
        ) {
            focusedInput.value = focusedInput.value - 1;
            e.preventDefault();
        }
    };

    const handleEscapeKey = () => {
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
    };

    const handleArrowKeyDown = () => {
        if (!filteredResults.value.length) return;
        selectedIndex.value =
            selectedIndex.value >= filteredResults.value.length - 1
                ? 0
                : selectedIndex.value + 1;
    };

    const handleArrowKeyUp = () => {
        if (!filteredResults.value.length) return;
        selectedIndex.value =
            selectedIndex.value <= 0
                ? filteredResults.value.length - 1
                : selectedIndex.value - 1;
    };

    const handleEnterKey = (selectedResult: Result) => {
        if (isMathExpression.value && calculatedResult.value) {
            navigator.clipboard.writeText(
                calculatedResult.value as unknown as string,
            );
            postWindowMessage("FROM_TAB_FILTER", "HIDE_OMNI_SEARCH");
        }
        console.log(selectedResult);
        switch (selectedResult.type) {
            case ResultType.Tab:
                postWindowMessage(
                    "FROM_TAB_FILTER",
                    "OPEN_SELECTED_TAB",
                    "tabId",
                    Number(selectedResult.id),
                );
                break;
            case ResultType.Command:
                window.open(
                    buildCommandUrl(
                        selectedResult as CommandResult,
                        parametersQuery,
                    ),
                );
                clearReactive(parametersQuery);
                break;
            case ResultType.Search:
            case ResultType.Bookmark:
                console.log(selectedResult);
                window.open(selectedResult.url);
                break;
        }
    };

    const handleTabKey = (e: Event, selectedResult: Result) => {
        e.preventDefault();
        if (selectedResult && selectedResult.type === ResultType.Command) {
            focusedInput.value =
                (focusedInput.value + 1) %
                ((filteredResults.value[selectedIndex.value] as CommandResult)
                    .parameters.length +
                    1);
        } else {
            const options = Object.values(GroupType) as GroupType[];
            const currentIndex = options.indexOf(currentGroupMode.value);

            const nextIndex = (currentIndex + 1) % options.length;
            currentGroupMode.value = options[nextIndex];
            selectedIndex.value = 0;
        }
    };

    return { handler };
};
