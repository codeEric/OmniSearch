import { chromeSendMessage } from "@/utilities/helpers";
import { ResultType, type ChromeBookmark } from "@/utilities/types";
import { ref } from "vue";

export function useBookmarks() {
    const bookmarks = ref<ChromeBookmark[]>([]);

    const fetchBookmarks = async () => {
        const bookmarkTreeNode: chrome.bookmarks.BookmarkTreeNode[] =
            await chromeSendMessage("GET_BOOKMARKS");

        const mappedBookmarks: ChromeBookmark[] | undefined =
            bookmarkTreeNode?.[0].children?.[0].children?.map((bookmark) => ({
                id: bookmark.id,
                title: bookmark.title,
                url: bookmark.url ?? "",
                icon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url ?? "").hostname}&sz=128`,
                type: ResultType.Bookmark,
            }));

        bookmarks.value = mappedBookmarks ?? [];
    };
    return {
        bookmarks,
        fetchBookmarks,
    };
}
