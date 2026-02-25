import { computed, ref, type Ref } from "vue";
import {
    ResultType,
    type Result,
    type ChromeBookmark,
    type BookmarkResult,
} from "@/utilities/types";

export function useBookmarkSearch(
    bookmarks: Ref<ChromeBookmark[]>,
    searchQuery: Ref<string>,
) {
    const selectedIndex = ref(0);

    const filteredBookmarks = computed<BookmarkResult[]>(() => {
        selectedIndex.value = 0;

        const query = searchQuery.value.toLowerCase();

        const filtered = query
            ? bookmarks.value.filter(
                  (bookmark) =>
                      bookmark.title?.toLowerCase().includes(query) ||
                      bookmark.url?.toLowerCase().includes(query),
              )
            : bookmarks.value;

        return filtered.slice(0, 6).map((bookmark) => ({
            id: bookmark.id,
            title: bookmark.title || "Untitled",
            type: ResultType.Bookmark,
            icon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=128`,
            url: bookmark.url,
        }));
    });

    return {
        filteredBookmarks,
    };
}
