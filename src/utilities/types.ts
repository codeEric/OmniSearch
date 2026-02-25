type BaseResult = {
    id: string;
    title: string;
    type: ResultType;
    icon?: string;
    url?: string;
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
    Bookmark = "Bookmark",
    Search = "Search",
    Command = "Command",
    TabGroup = "TabGroup",
    History = "History",
}

export type TabResult = Omit<BaseResult, "type"> & {
    type: ResultType.Tab;
};

export type BookmarkResult = Omit<BaseResult, "type"> & {
    type: ResultType.Bookmark;
};

export type TabGroupResult = Omit<BaseResult, "type"> & {
    type: ResultType.TabGroup;
    group?: ChromeTabGroup;
};

export type SearchResult = Omit<BaseResult, "type"> & {
    type: ResultType.Search;
};

export type CommandResult = Omit<BaseResult, "type"> & {
    type: ResultType.Command;
    parameters: ResultParameter[];
};

export type HistoryResult = Omit<BaseResult, "type"> & {
    type: ResultType.History;
};

export type Result =
    | TabResult
    | BookmarkResult
    | TabGroupResult
    | SearchResult
    | CommandResult
    | HistoryResult;

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
    id?: string;
    url?: string;
    title?: string;
    favIconUrl?: string;
    active?: boolean;
};

export type ChromeBookmark = {
    id: string;
    title: string;
    type: ResultType;
    icon: string;
    url: string;
};

export type ChromeTabGroup = {
    id: string;
    title: string;
    color: string;
};

export type ChromeTabWithGroup = ChromeTab & {
    group?: ChromeTabGroup;
};

export type TabFilterCommand = "HIDE_OMNI_SEARCH" | "OPEN_SELECTED_TAB";

export type TabFilterMessage = {
    type: "FROM_TAB_FILTER";
    command: TabFilterCommand;
    tabId?: number;
};

export enum GroupType {
    Tabs = "Tabs",
    Bookmarks = "Bookmarks",
    TabGroups = "TabGroups",
}

export type FlattenedResult =
    | {
          id: string;
          type: ResultType.Tab;
          tab: TabResult;
          parentGroup: TabGroupResult;
      }
    | Result;
