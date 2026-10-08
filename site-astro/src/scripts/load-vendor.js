/**
 * Load a vendor UMD bundle as a classic script (same semantics the Hugo
 * site gave them). Bundler CJS/ESM interop half-transforms some of these
 * files; a plain script tag executes them untouched, attaching their
 * globals to window.
 */
const loaded = new Map();

export function loadVendor(url) {
    if (!loaded.has(url)) {
        loaded.set(
            url,
            new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => resolve();
                script.onerror = reject;
                document.head.appendChild(script);
            }),
        );
    }
    return loaded.get(url);
}
