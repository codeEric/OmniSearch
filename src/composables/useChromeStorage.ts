import { onMounted, ref, watch, type Ref } from "vue";
import {
    ColorScheme,
    Theme,
    type ChromeStorageScheme,
    type Mapping,
    type UserPreferences,
} from "../utilities/types";

const userPreferences = ref<UserPreferences>({
    enabled: true,
    colorScheme: ColorScheme.Midnight,
    transparent: true,
    softGlowEffect: true,
    glowEffect: true,
    shineEffect: true,
    showDefault: true,
});

// [
//   {
//     keywords: ["gpt", "chatgpt", "chat"],
//     tab: {
//       id: crypto.randomUUID(),
//       title: "ChatGPT",
//       type: ResultType.Command,
//       icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
//       url: "https://chatgpt.com",
//       parameters: [
//         {
//           name: "prompt",
//           type: ResultParameterType.Query,
//           default: null,
//           required: false,
//           query: "q",
//         },
//       ],
//     },
//   },
//   {
//     keywords: ["wf", "workflow"],
//     tab: {
//       id: crypto.randomUUID(),
//       title: "Omega",
//       type: ResultType.Command,
//       icon: "https://www.google.com/s2/favicons?domain=omega365.com&sz=128",
//       url: "https://{domain}.omega365.com/nt/scope-items",
//       parameters: [
//         {
//           name: "workflow",
//           type: ResultParameterType.Query,
//           default: null,
//           required: false,
//           query: "/scope-workflow-form?ID",
//         },
//         {
//           name: "domain",
//           type: ResultParameterType.Replace,
//           default: "omega",
//           required: false,
//         },
//       ],
//     },
//   },
//   {
//     keywords: ["code", "csearch"],
//     tab: {
//       id: crypto.randomUUID(),
//       title: "Code Searh",
//       type: ResultType.Command,
//       icon: "https://www.google.com/s2/favicons?domain=omega365.com&sz=128",
//       url: "https://dev.omega365.com/nt/codesearch",
//       parameters: [
//         {
//           name: "workflow",
//           type: ResultParameterType.Query,
//           default: null,
//           required: false,
//           query: "searchTerm=",
//         },
//       ],
//     },
//   },
// ];

// [
//   {
//     keywords: ["gpt", "chatgpt", "chat"],
//     tab: {
//       icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
//       id: "025f5deb-32e3-494b-be2a-22493ada1eef",
//       parameters: [
//         {
//           default: null,
//           name: "prompt",
//           query: "q",
//           required: false,
//           type: 0,
//         },
//       ],
//       title: "ChatGPT",
//       type: "Command",
//       url: "https://chatgpt.com",
//     },
//   },
//   {
//     keywords: ["wf", "workflow"],
//     tab: {
//       icon: "https://www.google.com/s2/favicons?domain=omega365.com&sz=128",
//       id: "eb629fd1-230e-462a-8d9a-2274384c0342",
//       parameters: [
//         {
//           default: null,
//           name: "workflow",
//           query: "/scope-workflow-form?ID",
//           required: false,
//           type: 0,
//         },
//         {
//           default: "omega",
//           name: "domain",
//           required: false,
//           type: 1,
//         },
//       ],
//       title: "Omega",
//       type: "Command",
//       url: "https://{domain}.omega365.com/nt/scope-items",
//     },
//   },
//   {
//     keywords: ["code", "csearch"],
//     tab: {
//       icon: "https://www.google.com/s2/favicons?domain=omega365.com&sz=128",
//       id: "f6d06189-670d-4de4-8332-ce86b59d0bd3",
//       parameters: [
//         {
//           default: null,
//           name: "workflow",
//           query: "searchTerm=",
//           required: false,
//           type: 0,
//         },
//       ],
//       title: "Code Searh",
//       type: "Command",
//       url: "https://dev.omega365.com/nt/codesearch",
//     },
//   },
// ];

const mappings = ref<Mapping[]>([]);
let initialized = false;

export const useChromeSyncStorage = () => {
    const userPreferencesKey = "ss_userPreferences";
    const mappingsKey = "ss_mappings";

    // watch(mappings, (val) => saveToStorage(mappingsKey, val), { deep: true });

    const init = async () => {
        if (initialized) return;
        initialized = true;

        const data = await chrome.storage.sync.get([
            userPreferencesKey,
            mappingsKey,
        ]);

        if (data[userPreferencesKey]) {
            userPreferences.value = data[userPreferencesKey];
        }
        if (data[mappingsKey]) {
            mappings.value = data[mappingsKey];
        }

        listenToStorageChanges();
    };

    const listenToStorageChanges = () => {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area !== "sync") return;

            if (changes[userPreferencesKey]) {
                const next = changes[userPreferencesKey].newValue;
                if (!isEqual(next, userPreferences.value)) {
                    userPreferences.value = next;
                }
            }

            if (changes[mappingsKey]) {
                const next = changes[mappingsKey].newValue;
                if (!isEqual(next, mappings.value)) {
                    mappings.value = next;
                }
            }
        });
    };

    const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

    return {
        init,
        mappings,
        userPreferences,
    };
};
