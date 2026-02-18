import mainCss from "../main.css?inline";
import cardCss from "../card.css?inline";
import mappingCss from "../mapping.css?inline";

export async function initializeShadowHost() {
    const shadowHost = document.createElement("div");
    shadowHost.id = "os-ext-omni-search-shadow";

    const shadowRoot = shadowHost.attachShadow({ mode: "open" });

    const rootContainer = document.createElement("div");
    rootContainer.id = "os-ext-omni-search-root";

    const styleElement = document.createElement("style");
    styleElement.textContent = mainCss + "\n" + cardCss + "\n" + mappingCss;

    shadowRoot.appendChild(styleElement);
    shadowRoot.appendChild(rootContainer);

    return {
        shadowHost,
        rootContainer,
        shadowRoot,
    };
}
