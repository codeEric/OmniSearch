import { safeMathEval } from "../utilities/mathEval";
import { computed, type Ref } from "vue";

export const useMathExpressions = (searchQuery: Ref) => {
    const mathCheckRegex =
        /^[-+]?(\d+(\.\d*)?)(?:[+\-*/](\d+(\.\d*)?))*[+\-*/]$|^[-+]?(\d+(\.\d*)?)[+\-*/](\d+(\.\d*)?)(?:[+\-*/](\d+(\.\d*)?))*$/;

    const isMathExpression = computed(() => {
        return mathCheckRegex.test(searchQuery.value.replace(/\s/g, ""));
    });

    const calculatedResult = computed(() => {
        if (isMathExpression.value) {
            return safeMathEval(searchQuery.value);
        }
        return null;
    });

    return {
        isMathExpression,
        calculatedResult,
    };
};
