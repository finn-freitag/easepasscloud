import { readdir, readFile, writeFile } from "fs/promises";
import { Database } from "../models/Database";
import { GetAllUsers } from "./UserHelpers";
import { createReadStream, ReadStream } from "fs";
import { getServerConfig } from "./ServerConfigHelper";
import { getDefaultAutoUnlockTimeoutMinutes } from "../DefaultValues";

export async function GetAllDatabases(): Promise<Database[]> {
    let files = await readdir("./data/databasemetadata/");
    let dbMetadata: Database[] = await Promise.all(files.map(async f => {
        return JSON.parse(await readFile(`./data/databasemetadata/${f}`, "utf-8")) as Database;
    }));
    return dbMetadata;
}

export async function GetDatabasesOfUser(username: string): Promise<Database[]> {
    let users = await GetAllUsers();
    let user = users.find(u => u.username === username);
    if(!user) return [];
    let dbMetadata: Database[] = await Promise.all(user.databaseIDs.map(async f => {
        return JSON.parse(await readFile(`./data/databasemetadata/${f+".json"}`, "utf-8")) as Database;
    }));
    return dbMetadata;
}

export async function GetDatabase(databaseID: string): Promise<Database | null> {
    try {
        let dbMetadata: Database = JSON.parse(await readFile(`./data/databasemetadata/${databaseID+".json"}`, "utf-8")) as Database;
        return dbMetadata;
    } catch {
        return null;
    }
}

export async function SaveDatabase(database: Database): Promise<void> {
    await writeFile(`./data/databasemetadata/${database.id+".json"}`, JSON.stringify(database), "utf-8");
}

export function GetDatabaseStream(databaseID: string): ReadStream {
    let fn = `./data/databases/${databaseID}.epdb`;
    return createReadStream(fn);
}

export function WriteDatabase(databaseID: string, data: Uint8Array<ArrayBuffer>): Promise<void> {
    let fn = `./data/databases/${databaseID}.epdb`;
    return writeFile(fn, data);
}

export async function AutoUnlockAll(){
    let databases = await GetAllDatabases();
    let serverConfig = await getServerConfig();
    let lockMinutes = serverConfig.autoUnlockTimeoutMinutes || getDefaultAutoUnlockTimeoutMinutes();
    databases.forEach(db => {
        if(db.locked){
            let lastLock = db.lastLocked ? new Date(db.lastLocked) : new Date();
            if((new Date().getTime() - lastLock.getTime()) > (lockMinutes * 60 * 1000))
                db.locked = false;
            SaveDatabase(db);
        }
    });
}