import { GetAllDatabases, GetDatabasesOfUser } from "@/backend/helper/DatabaseHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    console.log("post /api/database");

    let body = await req.json();
    let sessionToken = body.sessionToken;

    if(!(await CheckSessionToken(sessionToken)))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let sessionData = await GetSessionInfo(sessionToken);

    if(!sessionData)
        return NextResponse.json({success: false, message: "Session not found."}, {status: 404});

    let user = await GetUserByUsername(sessionData.username);

    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    let databases = user.admin ? await GetAllDatabases() : await GetDatabasesOfUser(sessionData?.username!);

    return NextResponse.json({success: true, databases: databases});
}