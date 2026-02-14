import { createApp, ref, h, type Component } from "vue";
import type { ChromeTab } from "./types";

export function mountVueComponent(
    container: HTMLElement,
    component: Component,
) {
    const isVisible = ref(false);
    const tabs = ref<ChromeTab[]>([]);

    const app = createApp({
        setup() {
            window.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && isVisible.value) {
                    isVisible.value = false;
                }
            });

            return { isVisible, tabs };
        },
        render() {
            return isVisible.value
                ? h(component, {
                      tabs: tabs.value,
                      onClose: () => (isVisible.value = false),
                  })
                : null;
        },
    });

    app.mount(container);

    return {
        toggleComponent: (value: boolean, initialTabs?: any) => {
            isVisible.value = value;
            if (initialTabs) {
                tabs.value = initialTabs;
            }

            if (value) {
                setTimeout(() => {
                    const input =
                        container.parentElement?.shadowRoot?.querySelector(
                            "input",
                        );
                    input?.focus();
                }, 0);
            }
        },
        updateTabs: (updatedTabs?: any) => {
            tabs.value = updatedTabs;
        },
        destroy: () => app.unmount(),
    };
}
