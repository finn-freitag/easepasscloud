import { CreateAccessToken } from "@/backend/helper/AccessTokenHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let body: {
        username: string;
        databaseID: string;
        expiresAt: Date|null;
        sessionToken: string;
        readonly?: boolean;
    } = await req.json();

    if(!body.username || !body.databaseID || !body.sessionToken)
        return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });

    if(!(await CheckSessionToken(body.sessionToken)))
        return NextResponse.json({ success: false, message: "Invalid session token." }, { status: 401 });

    let info = await GetSessionInfo(body.sessionToken);
    if(!info)
        return NextResponse.json({ success: false, message: "Invalid session token." }, { status: 401 });

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    if(user.username !== body.username && !user.admin)
        return NextResponse.json({ success: false, message: "Insufficient permissions." }, { status: 403 });

    if(!user.databaseIDs.includes(body.databaseID) && !user.admin)
        return NextResponse.json({ success: false, message: "User does not have access to the specified database." }, { status: 403 });

    let accessToken = await CreateAccessToken(body.username, body.databaseID, body.expiresAt ? new Date(body.expiresAt) : null, body.readonly);

    return NextResponse.json({ success: true, accessToken: accessToken });
}