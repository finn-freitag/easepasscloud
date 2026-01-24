import { readdir, readFile, writeFile } from "fs/promises";
import { Database } from "../models/Database";
import { GetAllUsers } from "./UserHelpers";

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