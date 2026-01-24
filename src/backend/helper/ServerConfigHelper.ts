import { readFile, writeFile } from "fs/promises";
import { ServerConfig } from "../models/ServerConfig";
import { existsSync } from "fs";

export async function getServerConfig(): Promise<ServerConfig> {
    return JSON.parse(await readFile("./data/serverconfig.json", "utf-8")) as ServerConfig;
}

export async function saveServerConfig(config: ServerConfig): Promise<void> {
    return await writeFile("./data/serverconfig.json", JSON.stringify(config), "utf-8");
}

export async function isServerInitialized(): Promise<boolean> {
    return existsSync("./data/serverconfig.json");
}