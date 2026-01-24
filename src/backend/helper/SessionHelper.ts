import { readdir, readFile, unlink, writeFile } from "fs/promises";
import { GenerateRandomToken } from "./TokenHelper";
import { getServerConfig } from "./ServerConfigHelper";
import { DefaultSessionTimeoutHours } from "../DefaultValues";
import { existsSync } from "fs";
import { Session } from "../models/Session";

export async function CreateSessionToken(username: string): Promise<string> {
    let token = GenerateRandomToken();
    while(existsSync(`./data/sessiontokens/${token}.token`))
        token = GenerateRandomToken();
    await writeFile(`./data/sessiontokens/${token}.token`, JSON.stringify({ created: new Date(), username: username }), { encoding: "utf-8" });
    return token;
}

export async function InvalidateSessionToken(token: string) {
    try{
        await unlink(`./data/sessiontokens/${token}.token`);
    }catch{}
}

export async function CheckSessionToken(token: string): Promise<boolean> {
    try {
        let d = JSON.parse(await readFile(`./data/sessiontokens/${token}.token`, { encoding: "utf-8" }));
        if(!d.created)
            return false;
        let createdDate = new Date(d.created);
        let currentDate = new Date();
        let diff = (currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
        return diff <= ((await getServerConfig()).sessionTimeoutHours ?? DefaultSessionTimeoutHours);
    } catch {
        return false;
    }
}

export async function GetSessionInfo(token: string): Promise<Session | null> {
    try {
        let d = JSON.parse(await readFile(`./data/sessiontokens/${token}.token`, { encoding: "utf-8" }));
        return { username: d.username, created: new Date(d.created) };
    } catch {
        return null;
    }
}

export async function GetSessionOfUser(username: string): Promise<Session[]> {
    let sessions: Session[] = [];
    let sessionFiles = await readdir("./data/sessiontokens/");
    for (let sessionFile of sessionFiles) {
        let token = sessionFile.replace(".token", "");
        let sessionInfo = await GetSessionInfo(token);
        if (sessionInfo && sessionInfo.username === username) {
            sessions.push(sessionInfo);
        }
    }
    return sessions;
}

export async function RemoveAllExpiredSessionTokens() {
    let sessions = await readdir("./data/sessiontokens/");
    sessions.forEach(async (sessionFile) => {
        let token = sessionFile.replace(".token", "");
        let valid = await CheckSessionToken(token);
        if (!valid) {
            await InvalidateSessionToken(token);
        }
    });
}