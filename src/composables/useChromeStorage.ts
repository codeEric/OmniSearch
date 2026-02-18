import { ref } from "vue";
import {
    ColorScheme,
    ResultParameterType,
    ResultType,
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
//       title: "Code Search",
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
