import {
    ResultParameterType,
    ResultType,
    type Mapping,
    type ResultParameter,
} from "./types";

function createMapping(data: Partial<Mapping> = {}): Mapping {
    const defaultMapping: Mapping = {
        keywords: [],
        tab: {
            id: "",
            title: "",
            icon: "",
            url: "",
            parameters: [],
            type: ResultType.Command,
        },
    };

    return {
        ...defaultMapping,
        ...data,
        tab: {
            ...defaultMapping.tab,
            ...data.tab,
        },
    };
}

function createParameter(data: Partial<ResultParameter> = {}): ResultParameter {
    const defaultParameter: ResultParameter = {
        name: "",
        default: null,
        required: false,
        type: ResultParameterType.Query,
        query: "",
    };

    return {
        ...defaultParameter,
        ...data,
    };
}

export { createMapping, createParameter };
