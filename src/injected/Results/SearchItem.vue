<template>
    <div class="card-item" :class="{ 'selected': selectedResult }">
        <div class="card-item-content">
            <div class="card-item-left">
                <component v-if="result?.url && result.url.includes('chrome://')" :is="getChromeIcon(result.url)" />
                <img v-else-if="result?.icon" :src="result.icon" class="card-item-favicon" />
                <FolderIcon v-else-if="result.type === ResultType.TabGroup" :color="result.color" :size="24" />
                <span class="card-item-text">
                    {{ result?.title }}
                </span>
            </div>
            <div class="card-item-right">
                <span class="card-item-type-card">
                    {{ result.type }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ResultType, type Result } from '../../utilities/types';
import { ChromeGlobeIcon, ChromeAppsIcon, ChromeStarIcon, ChromeDownloadsIcon, ChromePuzzleIcon, ChromeFlaskIcon, ChromeChromeIcon, ChromeHistoryIcon, ChromeSettingsIcon, FolderIcon } from '../../components/icons';

const props = defineProps<{
    result: Result,
    selectedResult: boolean
}>();


const getChromeIcon = (url?: string) => {
    if (!url || !url.startsWith("chrome://")) return ChromeGlobeIcon;

    const strippedUrl = url.replace("chrome://", "");
    const iconMap: { path: string; component: any }[] = [
        { path: "apps", component: ChromeAppsIcon },
        { path: "bookmarks", component: ChromeStarIcon },
        { path: "downloads", component: ChromeDownloadsIcon },
        { path: "extensions", component: ChromePuzzleIcon },
        { path: "flags", component: ChromeFlaskIcon },
        { path: "history", component: ChromeHistoryIcon },
        { path: "newtab", component: ChromeChromeIcon },
        { path: "settings", component: ChromeSettingsIcon },
    ];

    for (const { path, component } of iconMap) {
        if (strippedUrl.includes(path)) {
            return component;
        }
    }

    return ChromeGlobeIcon;
};

</script>

<style scoped></style>
