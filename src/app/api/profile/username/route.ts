import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername, UpdateUsername } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let body = await req.json();
    let username = body.username;
    let newUsername = body.newUsername;
    let sessionToken = body.sessionToken;

    if(!username || !newUsername || !sessionToken)
        return NextResponse.json({success: false, message: "Missing parameters."}, {status: 400});

    if(await GetUserByUsername(newUsername))
        return NextResponse.json({success: false, message: "Username already taken."}, {status: 409});

    if(!(await CheckSessionToken(sessionToken)))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let info = await GetSessionInfo(sessionToken);
    if(!info)
        return NextResponse.json({success: false, message: "Session not found."}, {status: 401});

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    if(user.username !== username && !user.admin)
        return NextResponse.json({success: false, message: "You can only change your own username."}, {status: 403});

    await UpdateUsername(username, newUsername);

    return NextResponse.json({success: true, message: "Username updated successfully."});
}