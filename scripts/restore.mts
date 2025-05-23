#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import {flipFuses, FuseV1Options, FuseVersion} from "@electron/fuses";
import os from "os";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let LOCAL_APPDATA;
let ELEMENT_APP_PATH;
let ASAR_PATH;
let ASAR_BACKUP;
let UNPACKED_PATH;
let RUNTIME_FILE;

if (process.platform === "win32") {
    // === WINDOWS ==
    LOCAL_APPDATA = path.join(os.homedir(), "AppData", "Local", "element-desktop-nightly", "app-0.0.1-nightly2025052302");

    ELEMENT_APP_PATH = path.join(LOCAL_APPDATA, "resources");
    ASAR_PATH = path.join(ELEMENT_APP_PATH, "app.asar");
    ASAR_BACKUP = path.join(ELEMENT_APP_PATH, "app.asar.backup");
    UNPACKED_PATH = path.join(ELEMENT_APP_PATH, "app-unpacked");
    RUNTIME_FILE = "C:\\Users\\kikin\\AppData\\Local\\element-desktop-nightly\\app-0.0.1-nightly2025052204\\Element Nightly.exe";
} else if (process.platform === "darwin") {
    // === MAC OS ===
    ELEMENT_APP_PATH = "/Applications/Element Nightly.app/Contents/Resources";
    ASAR_PATH = path.join(ELEMENT_APP_PATH, "app.asar");
    ASAR_BACKUP = path.join(ELEMENT_APP_PATH, "app.asar.backup");
    UNPACKED_PATH = path.join(ELEMENT_APP_PATH, "app-unpacked");
    RUNTIME_FILE = path.resolve(ELEMENT_APP_PATH, "../MacOS/Element Nightly");
}

async function main() {
    console.log("🔁 Restoring Element...");

    // Restore asar
    if (await fs.pathExists(ASAR_BACKUP)) {
        console.log("📦 Restoring original app.asar...");
        await fs.copy(ASAR_BACKUP, ASAR_PATH);
        await fs.remove(ASAR_BACKUP);
        console.log("✅ app.asar restored.");
    } else {
        console.warn("⚠️ No backup found. Cannot restore app.asar.");
    }

    // Remove unpacked folder
    if (await fs.pathExists(UNPACKED_PATH)) {
        console.log("🗑 Removing unpacked files...");
        await fs.remove(UNPACKED_PATH);
    }

    console.log("⚙️ Restoring Electron fuses...");
    await flipFuses(
        RUNTIME_FILE,
        {
            version: FuseVersion.V1,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
        }
    )

    console.log("✅ Restoration complete.");
}

main().catch((err) => {
    console.error("❌ Restore failed:", err);
});
