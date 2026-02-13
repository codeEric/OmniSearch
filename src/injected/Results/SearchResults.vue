<template>
    <div>
        <template v-if="isMathExpression">
            <SearchCalculator :expression="mathExpression" :answer="mathExpressionResult"
                :selectedResult="adjustedSelectedIndex === -1" />
        </template>
        <template v-if="results.length > 0">
            <SearchItem v-for="(result, index) of results" :result="result"
                :class="{ 'card-item-second-half': index >= (results.length / 2) }"
                :selectedResult="adjustedSelectedIndex !== -1 ? results[adjustedSelectedIndex].id === result.id : false" />
        </template>
        <template v-if="results.length === 0 && !isMathExpression">
            <span class="card-no-result-text">No results found</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SearchCalculator from "./SearchCalculator.vue";
import SearchItem from './SearchItem.vue';
import type { Result } from "../../utilities/types";

const adjustedSelectedIndex = computed(() => {
    if (props.isMathExpression) {
        if (props.selectedResultIndex === 0) {
            return -1;
        }
        return props.selectedResultIndex - 1;
    }
    return props.selectedResultIndex;
});

const props = defineProps<{
    isMathExpression: boolean,
    mathExpression: string,
    mathExpressionResult: string | number,
    results: Result[],
    selectedResultIndex: number
}>();

</script>

<style scoped></style>