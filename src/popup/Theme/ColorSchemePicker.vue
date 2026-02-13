<template>
    <div class="color-scheme-picker-container">
        <span class="color-scheme-picker-label">Color Scheme</span>
        <div class="color-scheme-picker">
            <ColorSchemeCircle v-for="[scheme, hues] in Object.entries(colorSchemeMap)" :key="scheme"
                :topColor="hues.topHue" :bottomColor="hues.bottomHue"
                @onClick="userPreferences.colorScheme = (scheme as ColorScheme)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { colorSchemeMap } from '@/utilities/maps';
import ColorSchemeCircle from './ColorSchemeCircle.vue';
import { useChromeSyncStorage } from '@/composables';
import type { ColorScheme } from '@/utilities/types';

const { userPreferences } = useChromeSyncStorage();

</script>

<style scoped></style>
