<template>
    <div class="statusbar">
        <div class="statusbar-content">
            <span class="statusbar-keybind">
                <KeyCard :icon="ArrowUpIcon" />
                <KeyCard :icon="ArrowDownIcon" />
                Navigate
            </span>

            <span class="statusbar-keybind">
                <KeyCard :icon="ArrowBackIcon" />
                {{ selectKey }}
            </span>

            <span class="statusbar-keybind" v-if="showModKey">

                <KeyCard v-if="showCommandKey()" keyName="⌘" textClass="statusbar-card-text command-key" />
                <KeyCard v-else keyName="Esc" textClass="statusbar-card-text" />
                +
                <KeyCard :icon="ArrowBackIcon" />
                {{ selectKeyMod }}
            </span>
        </div>
        <div>
            <span class="statusbar-keybind">
                <KeyCard keyName="Esc" textClass="statusbar-card-text" />
                {{ escapeKey }}
            </span>

        </div>
    </div>
</template>

<script setup lang="ts">
import KeyCard from './KeyCard.vue';
import { ArrowUpIcon, ArrowDownIcon, ArrowBackIcon } from '../../components/icons';

defineProps({
    selectKey: {
        type: String,
        default: 'Select'
    },
    selectKeyMod: {
        type: String,
        default: 'Select'
    },
    escapeKey: {
        type: String,
        default: "Close"
    },
    showModKey: {
        type: Boolean,
        default: false
    }
});

const showCommandKey = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isMac = ua.includes("mac") || ua.includes("iphone") || ua.includes("ipad");
    return isMac;
}


</script>

<style scoped></style>