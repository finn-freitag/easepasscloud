export function getDefaultSessionTimeoutHours(): number {
    return parseInt(process.env.DEFAULT_SESSION_TIMEOUT_HOURS ?? "3");
}
export function getDefaultAccessTokenExpiryDays(): number {
    return parseInt(process.env.DEFAULT_ACCESS_TOKEN_EXPIRY_DAYS ?? "30");
}
export function getDefaultAutoUnlockTimeoutMinutes(): number {
    return parseInt(process.env.DEFAULT_AUTO_UNLOCK_TIMEOUT_MINUTES ?? "60");
}
export function getDefaultViewUpdateTime(): number {
    return parseInt(process.env.DEFAULT_VIEW_UPDATE_TIME ?? "5000");
}

export type DefaultValues = {
    sessionTimeoutHours: number;
    accessTokenExpiryDays: number;
    autoUnlockTimeoutMinutes: number;
    viewUpdateTime: number;
}

export function getDefaultValues(): DefaultValues {
    return {
        sessionTimeoutHours: getDefaultSessionTimeoutHours(),
        accessTokenExpiryDays: getDefaultAccessTokenExpiryDays(),
        autoUnlockTimeoutMinutes: getDefaultAutoUnlockTimeoutMinutes(),
        viewUpdateTime: getDefaultViewUpdateTime(),
    };
}