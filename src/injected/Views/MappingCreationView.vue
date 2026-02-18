<template>
    <MappingForm v-if="!addingNewParameter" v-model="mainForm" :newMapping="newMapping"
        @addNewParameter="addingNewParameter = true" />

    <ParameterForm v-else v-model="parameterForm" @save="saveParameter" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import MappingForm from '../Mappings/MappingForm.vue';
import { ResultParameterType, type ResultParameter } from '@/utilities/types';
import ParameterForm from '../Mappings/ParameterForm.vue';

const addingNewParameter = ref<boolean>(false);
const newMapping = ref<boolean>(true);

const mainForm = reactive({
    url: "",
    title: "",
    keywords: [],
    parameters: [] as ResultParameter[]
})

const parameterForm = reactive<ResultParameter>({
    name: "",
    default: "",
    query: "",
    required: false,
    type: ResultParameterType.Query
})

const saveParameter = () => {
    addingNewParameter.value = false;

    mainForm.parameters.push({ ...parameterForm });

    resetParameterForm();
}


const resetParameterForm = () => {
    parameterForm.name = "";
    parameterForm.default = "";
    parameterForm.query = "";
    parameterForm.required = false;
    parameterForm.type = ResultParameterType.Query;
}

</script>

<style scoped></style>