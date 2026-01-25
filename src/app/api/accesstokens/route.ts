import { GetAccessTokensByUser, GetAllAccessTokens } from "@/backend/helper/AccessTokenHelper";
import { GetDatabase } from "@/backend/helper/DatabaseHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { AccessToken } from "@/backend/models/AccessToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
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

    let accessTokens: any[] = user.admin ? await GetAllAccessTokens() : await GetAccessTokensByUser(sessionData?.username!);

    let result: {accessToken: AccessToken, databaseName?: string}[] = [];

    for (let token of accessTokens) {
        result.push({accessToken: token, databaseName: (await GetDatabase(token.databaseID))?.name});
    }

    return NextResponse.json({success: true, accessTokens: result});
}