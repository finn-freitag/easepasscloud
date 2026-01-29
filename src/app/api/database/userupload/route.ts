import { SaveDatabase, WriteDatabase } from '@/backend/helper/DatabaseHelper';
import { CheckSessionToken, GetSessionInfo } from '@/backend/helper/SessionHelper';
import { GenerateRandomToken } from '@/backend/helper/TokenHelper';
import { GetUserByUsername, SaveUser } from '@/backend/helper/UserHelpers';
import { Database } from '@/backend/models/Database';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log("post /api/database/userupload");

    const formData = await req.formData();

    const token = formData.get('sessionToken');
    if(!token || !(await CheckSessionToken(token.toString())))
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        
    const file = formData.get('databaseFile') as File;

    if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    let databaseToken = GenerateRandomToken();

    const buffer = new Uint8Array(await file.arrayBuffer());
    await WriteDatabase(databaseToken, buffer);

    const dbName = formData.get('databaseName')?.toString() || file.name.split('.').slice(0, -1).join('.');
    const isLockable = formData.get('isLockable')?.toString() === "true";

    const metadata: Database = {
        name: dbName,
        id: databaseToken,
        locked: false,
        lockable: isLockable,
        lastLocked: new Date(),
        lastModified: new Date(),
    }

    await SaveDatabase(metadata);

    let username = (await GetSessionInfo(token.toString()))?.username;

    if(!username)
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    let user = await GetUserByUsername(username);

    if(!user)
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    user.databaseIDs.push(databaseToken);

    await SaveUser(user);

    return NextResponse.json({ success: true, message: "Authenticated upload successful", databaseID: databaseToken });
}