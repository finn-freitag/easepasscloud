export type AccessToken = {
    token: string;
    userID: string;
    databaseID: string;
    expiresAt: Date;
    createdAt: Date;
    enabled: boolean;
}