<template>
    <div class="card-outer">
        <div class="card" :class="useMode">
            <span class="shine shine-top" v-if="userPreferences.shineEffect"></span>
            <span class="shine shine-bottom" v-if="userPreferences.shineEffect"></span>
            <span class="glow glow-top" :class="useMode" v-if="userPreferences.glowEffect"></span>
            <span class="glow glow-bottom" :class="useMode" v-if="userPreferences.glowEffect"></span>
            <span class="glow glow-bright glow-top" v-if="userPreferences.softGlowEffect"></span>
            <span class="glow glow-bright glow-bottom" v-if="userPreferences.softGlowEffect"></span>
            <div class="card-inner">
                <OmniSearch :tabs="tabs" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import "../main.css";
import { useChromeSyncStorage } from '../composables/useChromeStorage';
import OmniSearch from './OmniSearch.vue';
import type { ChromeTab } from '../utilities/types';
import { onMounted, watch } from 'vue';
import { useTheme } from "@/composables";

const { userPreferences, init } = useChromeSyncStorage();
const theme = useTheme();

onMounted(() => {
    init();
})

const props = defineProps<{
    tabs: ChromeTab[],
    useMode: 'dark' | 'light'
}>();

</script>

<style scoped></style>