import { readFile, unlink, writeFile } from "fs/promises";
import { User } from "../models/User";
import { HashArgon2, VerifyArgon2 } from "./HashHelper";
import { DeleteAccessToken } from "./AccessTokenHelper";

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

export async function UpdateUsername(oldUsername: string, newUsername: string): Promise<boolean> {
    let users = await GetAllUsers();
    let userIndex = users.findIndex(u=>u.username === oldUsername);
    if(userIndex === -1)
        return false;
    users[userIndex].username = newUsername;
    await SaveAllUsers(users);
    return true;
}

export async function DeleteUser(username: string){
    let user = await GetUserByUsername(username);
    user?.accessTokens.forEach((a)=>{
        DeleteAccessToken(a);
    });
    for(let d in user?.databaseIDs){
        await unlink("./data/databases/" + d + ".epdb");
        await unlink("./data/databasemetadata/" + d + ".json");
    }
    let users = await GetAllUsers();
    users = users.filter((u)=>u.username !== username);
    await SaveAllUsers(users);
}

export async function LoginUser(username: string, password: string): Promise<User|undefined> {
    let users = await GetAllUsers();
    for (const u of users) {
        if (u.username === username && await VerifyArgon2(u.passwordHash, password)) {
            return u;
        }
    }
    return undefined;
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