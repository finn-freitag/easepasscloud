import { AccessTokenExists, CheckAccessToken, DeleteAccessToken, SaveAccessToken } from "@/backend/helper/AccessTokenHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { AccessToken } from "@/backend/models/AccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("post /api/accesstokens/delete");

    let body: { accessToken: AccessToken, sessionToken: string } = await req.json();

    if(!body.accessToken || !body.sessionToken)
        return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });

    if(!(await CheckSessionToken(body.sessionToken)))
        return NextResponse.json({ success: false, message: "Invalid session token." }, { status: 401 });

    let info = await GetSessionInfo(body.sessionToken);
    if(!info)
        return NextResponse.json({ success: false, message: "Invalid session token." }, { status: 401 });

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    if(body.accessToken.userID !== user.username && !user.admin)
        return NextResponse.json({ success: false, message: "Insufficient permissions." }, { status: 403 });

    if(!AccessTokenExists(body.accessToken.token))
        return NextResponse.json({ success: false, message: "Access token is invalid." }, { status: 400 });

    await DeleteAccessToken(body.accessToken.token);

    return NextResponse.json({ success: true });
}