<template>
    <span class="input-label table-label">
        Parameters
        <PlusIcon class="table-label-plus-btn" :size="20" @click="emit('addNewParameter')" />
    </span>

    <table class="parameter-table">
        <thead>
            <tr>
                <th class="table-heading">Name</th>
                <th class="table-heading">Default</th>
                <th class="table-heading">Type</th>
                <th class="table-heading">Query</th>
                <th class="table-heading">Required</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="parameter of parameters">
                <td class="table-data">{{ parameter.name }}</td>
                <td class="table-data">{{ parameter.default }}</td>
                <td class="table-data">{{ parameter.type }}</td>
                <td class="table-data">{{ parameter.query }}</td>
                <td class="table-data">{{ parameter.required }}</td>
                <td class="table-data">
                    <div class="table-actions">
                        <EditIcon class="table-action" :size="22" color="#00CEC8" />
                        <TrashIcon class="table-action" :size="22" color="#FF746C" />
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import EditIcon from '@/components/icons/EditIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import type { ResultParameter } from '@/utilities/types';


const props = defineProps<{
    parameters: ResultParameter[]
}>();

const emit = defineEmits<{
    (e: 'addNewParameter'): void
}>();

</script>

<style scoped></style>