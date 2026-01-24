import { GetDatabasesOfUser } from "@/backend/helper/DatabaseHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    let body = await req.json();
    let sessionToken = body.sessionToken;

    if(!CheckSessionToken(sessionToken))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let sessionData = await GetSessionInfo(sessionToken);

    let databases = await GetDatabasesOfUser(sessionData?.username!);

    return NextResponse.json({success: true, databases: databases});
}