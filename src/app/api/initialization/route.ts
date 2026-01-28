import { HashArgon2 } from "@/backend/helper/HashHelper";
import { getServerConfig, isServerInitialized, saveServerConfig } from "@/backend/helper/ServerConfigHelper";
import { SaveAllUsers } from "@/backend/helper/UserHelpers";
import { ServerConfig } from "@/backend/models/ServerConfig";
import { User } from "@/backend/models/User";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
    
export async function GET(req: NextRequest){
    let initialized = await isServerInitialized();
    let serverconfig: ServerConfig | null = null;
    if(initialized)
        serverconfig = await getServerConfig();
    return NextResponse.json({ success: true, initialized: initialized, publicInstance: serverconfig?.publicInstance ?? null });
}

export async function POST(req: NextRequest){
    if(await isServerInitialized())
        return NextResponse.json({ success: false, message: "Server is already initialized." }, { status: 400 });

    if(!existsSync("./data"))
        await mkdir("./data");

    let body: {
        publicInstance: boolean,
        serverAddress: string,
        adminUsername: string,
        adminPassword: string
    } = await req.json();

    if(body.publicInstance === undefined || !body.serverAddress || !body.adminUsername || !body.adminPassword || body.adminUsername.length === 0 || body.adminPassword.length === 0)
        return NextResponse.json({ success: false, message: "Missing parameters." }, { status: 400 });

    let admin: User = {
        username: body.adminUsername,
        passwordHash: await HashArgon2(body.adminPassword),
        databaseIDs: [],
        admin: true
    }

    let users : User[] = [admin];

    SaveAllUsers(users);

    if(body.serverAddress.endsWith("/"))
        body.serverAddress = body.serverAddress.slice(0, -1);

    let serverconfig: ServerConfig = {
        publicInstance: body.publicInstance,
        serverAddress: body.serverAddress,
        sessionTimeoutHours: 24
    }

    await saveServerConfig(serverconfig);

    await mkdir("./data/databases");
    await mkdir("./data/accesstokens");
    await mkdir("./data/sessiontokens");
    await mkdir("./data/databasemetadata");
    
    return NextResponse.json({ success: true, message: "Server initialized successfully." });
}