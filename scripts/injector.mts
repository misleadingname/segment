#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import asar from "asar";
import { fileURLToPath } from "url";
import { flipFuses, FuseV1Options, FuseVersion } from "@electron/fuses";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURATION ===
const ELEMENT_APP_PATH = "/Applications/Element Nightly.app/Contents/Resources";
const ASAR_PATH = path.join(ELEMENT_APP_PATH, "app.asar");
const ASAR_BACKUP_PATH = path.join(ELEMENT_APP_PATH, "app.asar.backup");
const UNPACKED_PATH = path.join(ELEMENT_APP_PATH, "app-unpacked");
const SYMLINK_PATH = path.join(ELEMENT_APP_PATH, "app");
const INJECT_SCRIPT_PATH = path.resolve(__dirname, "../dist/loader.js");
const RUNTIME_FILE = path.resolve(ELEMENT_APP_PATH, "../MacOS/Element Nightly");
const MAIN_FILE = "lib/electron-main.js";

async function main() {
	console.log("📦 Starting Element injection...");

	if (!await fs.pathExists(ASAR_PATH)) {
		throw new Error("❌ app.asar not found — is Element installed correctly?");
	}

	console.log("📂 Extracting app.asar...");
	await fs.remove(UNPACKED_PATH);
	asar.extractAll(ASAR_PATH, UNPACKED_PATH);

	if (!await fs.pathExists(ASAR_BACKUP_PATH)) {
		console.log("🔁 Backing up app.asar...");
		await fs.move(ASAR_PATH, ASAR_BACKUP_PATH);
	} else {
		console.log("✅ Backup already exists, skipping.");
		await fs.remove(ASAR_PATH); // Remove app.asar to force folder loading
	}

	const mainFilePath = path.join(UNPACKED_PATH, MAIN_FILE);
	if (!await fs.pathExists(mainFilePath)) {
		throw new Error(`❌ Main file not found at ${MAIN_FILE}`);
	}

	console.log("✏️ Injecting loader...");
	let code = fs.readFileSync(mainFilePath, "utf8");
	const injectLine = `require("${INJECT_SCRIPT_PATH.replace(/\\/g, "\\\\")}");`;

	if (code.includes(injectLine)) {
		console.log("✅ Already injected, skipping.");
	} else {
		code = injectLine + "\n" + code;
		await fs.writeFile(mainFilePath, code, "utf8");
	}

	console.log("🔗 Creating symlink...");
	if (await fs.pathExists(SYMLINK_PATH)) {
		const stat = await fs.lstat(SYMLINK_PATH);
		if (stat.isSymbolicLink()) {
			await fs.remove(SYMLINK_PATH);
		} else {
			throw new Error("❌ 'app' exists and is not a symlink. Remove it manually.");
		}
	}
	await fs.symlink(UNPACKED_PATH, SYMLINK_PATH);

	console.log("🧨 Flipping Electron fuses...");
	await flipFuses(RUNTIME_FILE, {
		version: FuseVersion.V1,
		[FuseV1Options.OnlyLoadAppFromAsar]: false,
		[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
	});

	console.log("🎉 Injection complete! Launch Element to see it in action.");
}

main().catch((err) => {
	console.error("❌ Injection failed:", err);
});
