import * as path from "path";
import * as fs from "fs";

export function injectRenderer() {
    // Inject this via preload or expose globally
    (globalThis as any).loadRendererPlugins = () => {
        const pluginsPath = path.join(__dirname, "../plugins");

        fs.readdirSync(pluginsPath).forEach((folder) => {
            const pluginPath = path.join(pluginsPath, folder, "index.renderer.js");
            if (fs.existsSync(pluginPath)) {
                try {
                    const code = fs.readFileSync(pluginPath, "utf8");
                    eval(code);
                    console.log(`Renderer plugin loaded: ${folder}`);
                } catch (e) {
                    console.error(`Failed to load renderer plugin: ${folder}`, e);
                }
            }
        });
    };

    // Auto-load after DOM ready
    if (typeof window !== "undefined") {
        window.addEventListener("DOMContentLoaded", () => {
            (window as any).loadRendererPlugins?.();
        });
    }
}
