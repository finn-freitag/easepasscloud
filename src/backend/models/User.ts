export type User = {
    username: string;
    passwordHash: string;
    databaseIDs: string[];
    admin: boolean;
}