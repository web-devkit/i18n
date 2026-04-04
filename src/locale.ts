type Callback = () => void;

const listeners = new Set<Callback>();

let observer: MutationObserver | undefined;

function ensureObserver() {
    if (observer) return;
    observer = new MutationObserver(() => {
        listeners.forEach((cb) => cb());
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
    });
}

export function onLocaleChange(callback: Callback): () => void {
    listeners.add(callback);
    ensureObserver();
    return () => {
        listeners.delete(callback);
        if (listeners.size === 0 && observer) {
            observer.disconnect();
            observer = undefined;
        }
    };
}

export function resolveLocale(explicit?: string): string | undefined {
    return explicit || document.documentElement.lang || undefined;
}
