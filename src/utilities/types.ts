type BaseResult = {
    id: string;
    title: string;
    type: ResultType;
    icon: string;
    url: string;
};

export type ResultParameter = {
    name: string;
    default: string | null | undefined;
    required: boolean;
    query?: string;
    type: ResultParameterType;
};

export enum ResultParameterType {
    Query,
    Replace,
}

export enum Theme {
    Dark = "dark",
    Light = "light",
    System = "system",
    Custom = "custom",
}

export enum ColorScheme {
    Terminal = "Terminal",
    Ultraviolet = "Ultraviolet",
    Midnight = "Midnight",
    Horizon = "Horizon",
    Aurora = "Aurora",
    Sunset = "Sunset",
}

export enum ViewType {
    Default = "Default",
    MappingCreation = "MappingCreation",
    MappingEdit = "MappingEdit",
}

export type ColorSchemeHues = {
    topHue: number;
    bottomHue: number;
};

export enum ResultType {
    Tab = "Tab",
    Search = "Search",
    Command = "Command",
}

export type TabResult = Omit<BaseResult, "type"> & {
    type: ResultType.Tab;
};

export type SearchResult = Omit<BaseResult, "type"> & {
    type: ResultType.Search;
};

export type CommandResult = Omit<BaseResult, "type"> & {
    type: ResultType.Command;
    parameters: ResultParameter[];
};

export type Result = TabResult | SearchResult | CommandResult;

export type UserPreferences = {
    enabled: boolean;
    // theme: Theme;
    colorScheme: ColorScheme;
    glowEffect: boolean;
    shineEffect: boolean;
    softGlowEffect: boolean;
    transparent: boolean;
    showDefault: boolean;
};

export type Mapping = {
    keywords: string[];
    tab: CommandResult;
};

export type ChromeTab = {
    id?: number;
    url?: string;
    title?: string;
    favIconUrl?: string;
    active?: boolean;
};

export type TabFilterCommand = "HIDE_OMNI_SEARCH" | "OPEN_SELECTED_TAB";

export type TabFilterMessage = {
    type: "FROM_TAB_FILTER";
    command: TabFilterCommand;
    tabId?: number;
};

export enum GroupType {
    Tabs = "Tabs",
    TabGroups = "TabGroups",
    Bookmarks = "Bookmarks",
}
