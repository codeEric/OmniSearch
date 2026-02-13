<template>
    <span class="calculator-label">Calculator</span>
    <div class="calculator-container" :class="{ 'selected': selectedResult }">
        <span class="calculator-value">
            {{ expression }}
        </span>
        <ArrowRightIcon :size="32" color="#ffffff" />
        <span class="calculator-value">
            {{ safeMathEval(expression) }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '../../components/icons';
import { safeMathEval } from '../../utilities/mathEval';

const props = defineProps({
    expression: {
        type: String,
        default: null
    },
    result: {
        type: String,
        default: null
    },
    selectedResult: {
        type: Boolean,
        default: false
    }
});

</script>

<style scoped></style>