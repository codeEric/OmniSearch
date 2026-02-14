export const clearReactive = (obj: Record<string, unknown>) => {
    Object.keys(obj).forEach((key) => delete obj[key]);
};

export const getPageBackgroundMode = () => {
    let el = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2,
    );

    if (!el) return "light";

    function getEffectiveBackground(element: Element | null) {
        while (element) {
            const style = window.getComputedStyle(element);
            const bg = style.backgroundColor;

            if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
                return bg;
            }

            element = element.parentElement;
        }

        return "rgb(255, 255, 255)";
    }

    let bgColor = getEffectiveBackground(el);

    function normalizeColor(color: string) {
        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) return color;
        ctx.fillStyle = color;
        return ctx.fillStyle;
    }

    const rgb = normalizeColor(bgColor);

    const values = rgb.match(/\d+/g);
    if (!values) return "light";

    const [r, g, b] = values.map(Number);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 128 ? "dark" : "light";
};
