<template>
    <template v-for="(result, index) in results" :key="result.id">

        <SearchItem :result="result" :class="{ 'card-item-second-half': index >= results.length / 2 }"
            :selectedResult="isSelected(result.id)" />

        <SearchItem v-if="result.type === ResultType.TabGroup && result.tabs" v-for="tab in result.tabs" :key="tab.id"
            :result="tab" :class="{ 'card-item-second-half': index >= results.length / 2 }"
            :selectedResult="isSelected(tab.id)" />

    </template>
</template>

<script setup lang="ts">
import { ResultType, type FlattenedResult, type Result, type TabResult } from '@/utilities'
import SearchItem from './SearchItem.vue';
import { computed } from 'vue';

const props = defineProps<{
    results: Result[]
    adjustedSelectedIndex: number
}>()

const flattenedResults = computed(() => {
    return props.results.flatMap(
        (item: Result): FlattenedResult[] => {
            if (item.type === ResultType.TabGroup) {
                return (
                    item.tabs?.map((tab: TabResult) => ({
                        id: tab.id,
                        type: ResultType.Tab,
                        tab,
                        parentGroup: item,
                    })) || []
                );
            } else {
                return [
                    {
                        ...item
                    },
                ];
            }
        },
    );
});

const isSelected = (id: string) => {
    if (props.adjustedSelectedIndex === -1) return false
    return flattenedResults.value?.[props.adjustedSelectedIndex]?.id === id
}
</script>