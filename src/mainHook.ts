import * as path from "path";
import * as fs from "fs";

export function injectMain() {
    const pluginsPath = path.join(__dirname, "../src/plugins");

    fs.readdirSync(pluginsPath).forEach((folder) => {
        const pluginEntry = path.join(pluginsPath, folder, "index.js");
        if (fs.existsSync(pluginEntry)) {
            try {
                const plugin = require(pluginEntry);
                plugin?.start?.();
                console.log(`Main plugin loaded: ${folder}`);
            } catch (e) {
                console.error(`Failed to load main plugin: ${folder}`, e);
            }
        }
    });
}
