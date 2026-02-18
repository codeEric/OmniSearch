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

export const getHexFromColorName = (
    colorName: chrome.tabGroups.TabGroup["color"],
): string => {
    const colorMap: Record<chrome.tabGroups.TabGroup["color"], string> = {
        grey: "#dadce0",
        blue: "#89b5f8",
        red: "#f28b82",
        yellow: "#fdd663",
        green: "#80c995",
        pink: "#ff8acb",
        purple: "#c68af9",
        cyan: "#77d9ec",
        orange: "#fcad6f",
    };

    return colorMap[colorName] || "#000000";
};

export const chromeSendMessage = (
    command: string,
    dataKey: string,
    data: unknown,
) => {
    chrome.runtime.sendMessage({
        command: command,
        [dataKey]: data,
    });
};

export const postWindowMessage = (
    type: string,
    command: string,
    dataKey?: string,
    data?: unknown,
    targetOrigin: string = "*",
) => {
    const payload: { type: string; command: string; [key: string]: unknown } = {
        type,
        command,
    };

    if (dataKey) {
        payload[dataKey] = data;
    }

    window.postMessage(payload, targetOrigin);
};
