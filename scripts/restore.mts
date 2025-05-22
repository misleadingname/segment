#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import {flipFuses, FuseV1Options, FuseVersion} from "@electron/fuses";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CHANGE THIS TO YOUR ELEMENT INSTALL
const ELEMENT_APP_PATH = "/Applications/Element Nightly.app/Contents/Resources";
const ASAR_PATH = path.join(ELEMENT_APP_PATH, "app.asar");
const ASAR_BACKUP = path.join(ELEMENT_APP_PATH, "app.asar.backup");
const UNPACKED_PATH = path.join(ELEMENT_APP_PATH, "app-unpacked");
const RUNTIME_FILE = path.resolve(path.join(ELEMENT_APP_PATH, "../MacOS/Element Nightly"))

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
