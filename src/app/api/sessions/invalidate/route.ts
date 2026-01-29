import { GetSessionInfo, InvalidateSessionToken } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("post /api/sessions/invalidate");

    let body = await req.json();
    let sessionToken = body.sessionToken;
    let sessionTokenToInvalidate = body.sessionTokenToInvalidate;

    if(!sessionToken)
        return NextResponse.json({success: false, message: "No session token provided."}, {status: 400});

    if(!(await GetSessionInfo(sessionToken)))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let info = await GetSessionInfo(sessionToken);
    if(!info)
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    if(!user.admin)
        return NextResponse.json({success: false, message: "Insufficient permissions."}, {status: 403});

    await InvalidateSessionToken(sessionTokenToInvalidate);

    return NextResponse.json({success: true});
}