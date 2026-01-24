import { readFile, writeFile } from "fs/promises";
import { User } from "../models/User";
import { HashArgon2, VerifyArgon2 } from "./HashHelper";

export async function GetAllUsers(): Promise<User[]> {
    let users: User[] = JSON.parse(await readFile("./data/users.json", "utf-8"));
    return users;
}

export async function SaveAllUsers(users: User[]): Promise<void> {
    await writeFile("./data/users.json", JSON.stringify(users), "utf-8");
}

export async function GetUserByUsername(username: string): Promise<User|undefined> {
    let users = await GetAllUsers();
    return users.find(u=>u.username === username);
}

export async function SaveUser(user: User): Promise<void> {
    let users = await GetAllUsers();
    let existingIndex = users.findIndex(u=>u.username === user.username);
    if(existingIndex !== -1) 
        users[existingIndex] = user;
    else
        users.push(user);
    await SaveAllUsers(users);
}

export async function LoginUser(username: string, password: string): Promise<User|undefined> {
    return (await GetAllUsers()).find(async u=>u.username === username && await VerifyArgon2(u.passwordHash, password));
}

export async function RegisterUser(username: string, password: string): Promise<User|undefined> {
    let users = await GetAllUsers();
    if(users.find(u=>u.username === username))
        return undefined;
    let passwordHash = await HashArgon2(password);
    let newUser: User = {
        username: username,
        passwordHash: passwordHash,
        databaseIDs: [],
        accessTokens: [],
        admin: false
    };
    users.push(newUser);
    await SaveAllUsers(users);
    return newUser;
}