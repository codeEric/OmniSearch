import {
    ResultParameterType,
    type CommandResult,
    type ResultParameter,
} from "./types";

export const replaceUrl = (
    baseUrl: string,
    replaceParameters?: ResultParameter[],
    parametersQuery?: Record<string, string>,
) => {
    if (!replaceParameters) {
        return baseUrl;
    }
    replaceParameters.forEach((parameter) => {
        baseUrl = baseUrl.replace(
            `{${parameter.name}}`,
            encodeURIComponent(
                parametersQuery?.[parameter.name] ?? parameter.default!,
            ),
        );
    });

    return baseUrl;
};

const buildQuery = (
    queryParameters: ResultParameter[],
    parametersQuery: Record<string, string>,
) => {
    const queries = queryParameters.map((parameter) => {
        let queryValue = parametersQuery?.[parameter.name] ?? parameter.default;
        if (
            (queryValue === undefined || queryValue === null) &&
            (parameter.default === undefined || parameter.default === null)
        ) {
            return;
        }
        queryValue = encodeURIComponent(queryValue);
        return parameter.query + "=" + queryValue;
    });
    if (queries.length > 0) {
        return `?${queries.join("&")}`;
    }

    return "";
};

export const buildCommandUrl = (
    command: CommandResult,
    parametersQuery: Record<string, string>,
) => {
    let baseUrl = command.url.trim().replace(/ /g, "");
    let query = "";
    const replaceParameters = command.parameters.filter(
        (parameter) => parameter.type === ResultParameterType.Replace,
    );
    console.log(command.parameters);

    if (replaceParameters.length > 0) {
        baseUrl = replaceUrl(baseUrl, replaceParameters, parametersQuery);
    }

    const queryParameters = command.parameters.filter(
        (parameter) => parameter.type === ResultParameterType.Query,
    );

    if (queryParameters.length > 0) {
        query = buildQuery(queryParameters, parametersQuery);
    }

    return baseUrl + query;
};

export const getDomain = (url: string) => {
    const hostname = new URL(url).hostname.toLowerCase();
    const parts = hostname.split(".");

    if (parts.length === 1) {
        return hostname;
    }

    const multiPartTlds = new Set([
        "co.uk",
        "org.uk",
        "gov.uk",
        "ac.uk",
        "sch.uk",
        "com.au",
        "net.au",
        "org.au",
        "com.br",
        "net.br",
        "org.br",
        "co.nz",
        "org.nz",
        "gov.nz",
        "co.in",
        "net.in",
        "org.in",
    ]);

    for (const tld of multiPartTlds) {
        if (hostname.endsWith("." + tld)) {
            const tldParts = tld.split(".").length;
            const domain = parts[parts.length - (tldParts + 1)];
            return domain + "." + tld;
        }
    }

    const domain = parts[parts.length - 2];
    const tld = parts[parts.length - 1];
    return `${domain}.${tld}`;
};

export const buildIconUrl = (url: string) => {
    const domainTLD = getDomain(url);

    return `https://www.google.com/s2/favicons?domain=${domainTLD}&sz=128`;
};
