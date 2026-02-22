<template>
    <div class="search-result-container" ref="containerRef">
        <template v-if="isMathExpression">
            <SearchCalculator :expression="mathExpression" :answer="mathExpressionResult"
                :selectedResult="adjustedSelectedIndex === -1" />
        </template>
        <template v-else-if="results.length > 0">
            <SearchResult :results="results" :adjustedSelectedIndex="adjustedSelectedIndex"
                :registerItem="registerItem" />
        </template>
        <template v-else>
            <span class="card-no-result-text">No results found</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, type ComponentPublicInstance, useTemplateRef } from "vue"
import SearchCalculator from "./SearchCalculator.vue"
import SearchResult from "./SearchResult.vue"
import type { Result } from "../../utilities/types"

const props = defineProps<{
    isMathExpression: boolean
    mathExpression: string
    mathExpressionResult: string | number
    results: Result[]
    selectedResultIndex: number
}>()

const adjustedSelectedIndex = computed(() => {
    if (props.isMathExpression) {
        if (props.selectedResultIndex === 0) {
            return -1
        }
        return props.selectedResultIndex - 1
    }
    return props.selectedResultIndex
})

const containerRef = useTemplateRef('containerRef');
const itemRefs = ref<(HTMLElement | null)[]>([])

function registerItem(
    el: Element | ComponentPublicInstance | null,
    index: number
) {
    if (!el) {
        itemRefs.value[index] = null
        return
    }

    if ("$el" in el) {
        itemRefs.value[index] = el.$el as HTMLElement
    } else {
        itemRefs.value[index] = el as HTMLElement
    }
}

watch(
    () => adjustedSelectedIndex.value,
    async (newIndex) => {
        if (newIndex < 0) return

        await nextTick()

        const container = containerRef.value
        const el = itemRefs.value[newIndex]

        if (!container || !el) return

        const containerRect = container.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()

        const offsetTop = elRect.top - containerRect.top + container.scrollTop
        const offsetBottom = offsetTop + elRect.height

        if (offsetTop < container.scrollTop) {
            container.scrollTop = offsetTop
        } else if (offsetBottom > container.scrollTop + container.clientHeight) {
            container.scrollTop = offsetBottom - container.clientHeight
        }
    }
)

watch(
    () => props.results,
    () => {
        itemRefs.value = []
    }
)
</script>