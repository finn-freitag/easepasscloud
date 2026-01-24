export type ServerConfig = {
    publicInstance: boolean;
    serverAddress: string;
    sessionTimeoutHours?: number;
    linkToImprint?: string;
    linkToPrivacyPolicy?: string;
}