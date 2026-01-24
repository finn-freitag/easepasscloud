import argon2 from 'argon2';

export async function HashArgon2(password: string, salt: string = "easepasscloud"): Promise<string> {
    return await argon2.hash(password + salt);
}

export async function VerifyArgon2(hash: string, password: string, salt: string = "easepasscloud"): Promise<boolean> {
    return await argon2.verify(hash, password + salt);
}