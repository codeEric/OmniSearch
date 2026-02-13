import { ColorScheme, type ColorSchemeHues } from "./types";

export const colorSchemeMap: Record<ColorScheme, ColorSchemeHues> = {
    [ColorScheme.Terminal]: { topHue: 0, bottomHue: 128 },
    [ColorScheme.Ultraviolet]: { topHue: 280, bottomHue: 110 },
    [ColorScheme.Midnight]: { topHue: 210, bottomHue: 320 },
    [ColorScheme.Horizon]: { topHue: 165, bottomHue: 40 },
    [ColorScheme.Aurora]: { topHue: 190, bottomHue: 275 },
    [ColorScheme.Sunset]: { topHue: 25, bottomHue: 215 },
};
