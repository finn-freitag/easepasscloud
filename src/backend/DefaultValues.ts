export const DefaultSessionTimeoutHours = parseInt(process.env.DEFAULT_SESSION_TIMEOUT_HOURS ?? "3");
export const DefaultAccessTokenExpiryDays = parseInt(process.env.DEFAULT_ACCESS_TOKEN_EXPIRY_DAYS ?? "30");
export const DefaultAutoUnlockTimeoutMinutes = parseInt(process.env.DEFAULT_AUTO_UNLOCK_TIMEOUT_MINUTES ?? "60");
export const DefaultViewUpdateTime = parseInt(process.env.DEFAULT_VIEW_UPDATE_TIME ?? "5000");