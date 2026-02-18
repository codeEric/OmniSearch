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
