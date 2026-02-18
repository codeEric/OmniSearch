import {
    PredefinedCommandType,
    ResultType,
    type AddMapping,
    type ChromeBookmark,
    type ChromeTabGroup,
    type Result,
} from "./types";

export function isChromeTabGroup(result: any): result is ChromeTabGroup {
    return (
        result != null &&
        typeof result.id === "string" &&
        typeof result.title === "string" &&
        typeof result.color === "string" &&
        result.url === null &&
        result.type === ResultType.PredefinedCommand
    );
}

export function isTabGroupArray(
    arr: any[],
): arr is chrome.tabGroups.TabGroup[] {
    return (
        Array.isArray(arr) &&
        arr.every((item) => item && typeof item.windowId === "number")
    );
}

export function isBookmarkArray(
    arr: any[],
): arr is chrome.bookmarks.BookmarkTreeNode[] {
    return (
        Array.isArray(arr) &&
        arr.every((item) => item && typeof item.dateAdded === "number")
    );
}

export function isPredefinedCommand(result: Result): result is
    | (ChromeBookmark & {
          type: ResultType.PredefinedCommand;
          predefinedCommandType: PredefinedCommandType;
          cardName?: string;
      })
    | (ChromeTabGroup & {
          type: ResultType.PredefinedCommand;
          predefinedCommandType: PredefinedCommandType;
          cardName?: string;
      })
    | (AddMapping & {
          type: ResultType.PredefinedCommand;
          predefinedCommandType: PredefinedCommandType;
          cardName?: string;
      }) {
    return result.type === ResultType.PredefinedCommand;
}
