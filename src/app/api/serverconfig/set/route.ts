import { getServerConfig, saveServerConfig } from "@/backend/helper/ServerConfigHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("post /api/serverconfig/set");

    let body = await req.json();

    if (!body.sessionToken)
        return NextResponse.json({ success: false, message: "No session token provided." }, { status: 400 });

    if(!(await CheckSessionToken(body.sessionToken)))
        return NextResponse.json({ success: false, message: "Invalid session token." }, { status: 401 });

    let info = await GetSessionInfo(body.sessionToken);
    if(!info)
        return NextResponse.json({ success: false, message: "Session not found." }, { status: 404 });

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    if(!user.admin)
        return NextResponse.json({ success: false, message: "Insufficient permissions." }, { status: 403 });

    await saveServerConfig(body.serverConfig);

    return NextResponse.json({ success: true });
}