import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { DeleteUser, GetUserByUsername } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    console.log("post /api/users/delete");

    let body = await req.json();
    let sessionToken = body.sessionToken;
    let username = body.username;

    if(!sessionToken || !username)
        return NextResponse.json({success: false, message: "Missing parameters."}, {status: 400});

    if(!(await CheckSessionToken(sessionToken)))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let info = await GetSessionInfo(sessionToken);
    if(!info)
        return NextResponse.json({success: false, message: "Session not found."}, {status: 404});

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    if(!user.admin)
        return NextResponse.json({success: false, message: "Insufficient permissions."}, {status: 403});

    await DeleteUser(username);

    return NextResponse.json({success: true, message: "User deleted successfully."});
}