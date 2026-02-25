<template>
    <template v-for="(result, index) in resultsWithFolderFlag" :key="result.id">

        <SearchItemFolder v-if="result.showFolder" :color="(result as TabGroupResult).group?.color ?? '#000000'"
            :title="(result as TabGroupResult).group?.title ?? 'Untitled'" :type="result.type" />

        <SearchItem :result="result" :class="{ 'card-item-second-half': index >= resultsWithFolderFlag.length / 2 }"
            :selectedResult="isSelected(result.id)" :ref="el => registerItem(el, index)" />

    </template>
</template>

<script setup lang="ts">
import { ResultType, type Result, type TabGroupResult } from '@/utilities'
import SearchItem from './SearchItem.vue';
import { computed, type ComponentPublicInstance } from 'vue';
import SearchItemFolder from './SearchItemFolder.vue';

const props = defineProps<{
    results: Result[]
    adjustedSelectedIndex: number
    registerItem: (el: Element | ComponentPublicInstance | null, index: number) => void
}>()

const resultsWithFolderFlag = computed(() => {
    if (props.results.length > 0 && props.results[0].type === ResultType.TabGroup && !props.results[0]?.group) {
        return []
    }
    const seenGroups = new Set<string>()

    return props.results.map(result => {
        const showFolder =
            result.type === ResultType.TabGroup &&
            !seenGroups.has(result.group!.id)

        if (result.type === ResultType.TabGroup) {
            seenGroups.add(result.group!.id)
        }

        return {
            ...result,
            showFolder
        }
    })
})

const isSelected = (id: string) => {
    if (props.adjustedSelectedIndex === -1) return false
    return props.results?.[props.adjustedSelectedIndex]?.id === id
}
</script>