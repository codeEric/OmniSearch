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

export enum PredefinedCommandType {
    TabGroups = "tabgroups",
    Bookmarks = "bookmarks",
    Mappings = "mappings",
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
    PredefinedCommand = "PredefinedCommand",
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

export type PredefinedCommandResult = (
    | ChromeBookmark
    | ChromeTabGroup
    | CommandResult
) & {
    type: ResultType.PredefinedCommand;
    cardName?: string;
    predefinedCommandType: PredefinedCommandType;
};

export type Result =
    | TabResult
    | SearchResult
    | CommandResult
    | PredefinedCommandResult;

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

export type ChromeStorageScheme<T> = {
    [key: string]: T;
};

export type Mapping = {
    keywords: string[];
    tab: CommandResult;
};

export type PredefinedCommand =
    | {
          type: PredefinedCommandType.TabGroups;
          data: chrome.tabGroups.TabGroup[];
      }
    | {
          type: PredefinedCommandType.Bookmarks;
          data: chrome.bookmarks.BookmarkTreeNode[];
      }
    | { type: PredefinedCommandType.Mappings; data: Mapping[] };

export type SpecialMapping = {
    keywords: string[];
    action: () => Promise<PredefinedCommand>;
    filterQuery?: string;
};

export type ChromeTab = {
    id?: number;
    url?: string;
    title?: string;
    favIconUrl?: string;
    active?: boolean;
};

export type ChromeBookmark = {
    id: string;
    title: string;
    url: string;
    icon: string;
    filterQuery?: string;
};

export type ChromeTabGroup = {
    id: string;
    title: string;
    color: string;
    url: null;
    filterQuery?: string;
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
    Mappings = "Mappings",
}
