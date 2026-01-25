export type AccessToken = {
    token: string;
    userID: string;
    databaseID: string;
    expiresAt: Date|null;
    createdAt: Date;
    enabled: boolean;
    readonly: boolean;
}