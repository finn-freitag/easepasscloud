import { existsSync } from "fs";
import { AccessToken } from "../models/AccessToken";
import { GenerateRandomToken } from "./TokenHelper";
import { readdir, readFile, unlink, writeFile } from "fs/promises";

export async function CreateAccessToken(username: string, databaseID: string, expiresAt: Date|null, readonly?: boolean): Promise<AccessToken> {
    let token = GenerateRandomToken();
    while(existsSync(`./data/accesstokens/${token}.json`))
        token = GenerateRandomToken();

    let accessToken: AccessToken = {
        token: token,
        userID: username,
        databaseID: databaseID,
        expiresAt: expiresAt,
        createdAt: new Date(),
        enabled: true,
        readonly: readonly ?? false
    };

    await SaveAccessToken(accessToken);

    return accessToken;
}

export function AccessTokenExists(token: string): boolean {
    return existsSync(`./data/accesstokens/${token}.json`);
}

export async function CheckAccessToken(token: string): Promise<boolean> {
    try {
        let accessToken = await GetAccessToken(token);
        if (!accessToken || !accessToken.enabled) {
            return false;
        }
        if (accessToken.expiresAt && new Date() > new Date(accessToken.expiresAt)) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export async function GetAllAccessTokens(): Promise<AccessToken[]> {
    let files = await readdir("./data/accesstokens");
    let accessTokens: AccessToken[] = [];
    for(const file of files) {
        let accessToken: AccessToken = JSON.parse(await readFile(`./data/accesstokens/${file}`, { encoding: "utf-8" }));
        accessTokens.push(accessToken);
    }
    return accessTokens;
}

export async function GetAccessTokensByUser(username: string): Promise<AccessToken[]> {
    let allTokens = await GetAllAccessTokens();
    return allTokens.filter(t=>t.userID === username);
}

export async function DeleteAccessToken(token: string): Promise<void> {
    await unlink(`./data/accesstokens/${token}.json`);
}

export async function DeleteAccessTokensByDatabase(databaseID: string): Promise<void> {
    let allTokens = await GetAllAccessTokens();
    for(const token of allTokens) {
        if(token.databaseID === databaseID) {
            await DeleteAccessToken(token.token);
        }
    }
}

export async function GetAccessToken(token: string): Promise<AccessToken|null> {
    if(!existsSync(`./data/accesstokens/${token}.json`))
        return null;
    let accessToken: AccessToken = JSON.parse(await readFile(`./data/accesstokens/${token}.json`, { encoding: "utf-8" }));
    return accessToken;
}

export async function SaveAccessToken(accessToken: AccessToken): Promise<void> {
    await writeFile(`./data/accesstokens/${accessToken.token}.json`, JSON.stringify(accessToken), "utf-8");
}

export async function RemoveExpiredAccessTokens(): Promise<void> {
    let accessTokens = await GetAllAccessTokens();
    for(const accessToken of accessTokens) {
        if(accessToken.expiresAt && new Date() > new Date(accessToken.expiresAt)) {
            await DeleteAccessToken(accessToken.token);
        }
    }
}