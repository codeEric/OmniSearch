<template>
    <div class="popup-container">
        <div class="popup-header">
            <h1 class="popup-header-title">OmniSearch | <span class="popup-header-ext-state"
                    :class="{ 'enabled': userPreferences.enabled }">{{
                        userPreferences.enabled ?
                            'Enabled' : 'Disabled'
                    }}</span></h1>
            <PowerToggleButton :modelValue="userPreferences.enabled" />
        </div>
        <div class="popup-content">
            <div class="popup-toggle-group">
                <Toggle id="glowEffect" label="Glow Effect" v-model="userPreferences.glowEffect" />
                <Toggle id="shineEffect" label="Shine Effect" v-model="userPreferences.shineEffect" />
                <Toggle id="glowingBorder" label="Soft Glow Effect" v-model="userPreferences.softGlowEffect" />
                <Toggle id="transparent" label="Transparent Background" v-model="userPreferences.transparent" />
                <Toggle id="showDefault" label="Show Default" v-model="userPreferences.showDefault" />
            </div>
        </div>
        <ColorSchemePicker />
    </div>
</template>

<script setup lang="ts">
import PowerToggleButton from '../components/PowerToggleButton.vue';
import { useChromeSyncStorage } from '../composables/useChromeStorage';
import Toggle from '../components/Toggle.vue';
import ColorSchemePicker from './Theme/ColorSchemePicker.vue';
import { onMounted, watch } from 'vue';

const { userPreferences, init } = useChromeSyncStorage();

onMounted(async () => {
    await init();
});

watch(
    userPreferences,
    (val) => {
        chrome.runtime.sendMessage({
            command: "update_user_preferences",
            payload: val,
        });
    },
    { deep: true }
);

</script>

<style scoped></style>
