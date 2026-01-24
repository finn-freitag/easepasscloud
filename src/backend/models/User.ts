export type User = {
    username: string;
    passwordHash: string;
    databaseIDs: string[];
    accessTokens: string[];
    admin: boolean;
}