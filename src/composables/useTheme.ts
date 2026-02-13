import { ref, watch } from "vue";
import { useChromeSyncStorage } from "./useChromeStorage";
import { colorSchemeMap } from "../utilities/maps";
import { ColorScheme } from "../utilities/types";

export function useTheme() {
    const { userPreferences } = useChromeSyncStorage();

    const colorSchemeHues =
        colorSchemeMap[
            userPreferences.value.colorScheme || ColorScheme.Midnight
        ];

    const topHue = ref(colorSchemeHues.topHue);
    const bottomHue = ref(colorSchemeHues.bottomHue);

    const setCSSVar = (name: string, value: number) => {
        document.documentElement.style.setProperty(name, value.toString());
    };

    watch(
        () => userPreferences.value.colorScheme,
        (scheme) => {
            const hues = colorSchemeMap[scheme || ColorScheme.Midnight];
            topHue.value = hues.topHue;
            bottomHue.value = hues.bottomHue;
        },
        { immediate: true }
    );
    watch(topHue, (v) => setCSSVar("--topHue", v), { immediate: true });
    watch(bottomHue, (v) => setCSSVar("--bottomHue", v), { immediate: true });

    return {
        topHue,
        bottomHue,
        setCSSVar,
    };
}
