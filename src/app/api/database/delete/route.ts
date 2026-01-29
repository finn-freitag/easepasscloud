import { DeleteAccessToken, DeleteAccessTokensByDatabase } from "@/backend/helper/AccessTokenHelper";
import { GetDatabase } from "@/backend/helper/DatabaseHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername, SaveUser } from "@/backend/helper/UserHelpers";
import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    console.log("post /api/database/delete");

    let body = await req.json() as { databaseId: string, sessionToken: string };

    if(!body.databaseId || !body.sessionToken)
        return NextResponse.json({success: false, message: "Missing parameters."}, {status: 400});

    if(!(await CheckSessionToken(body.sessionToken)))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let username = (await GetSessionInfo(body.sessionToken))?.username;

    if(!username)
        return NextResponse.json({success: false, message: "Session not found."}, {status: 401});

    let user = await GetUserByUsername(username);

    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    let database = await GetDatabase(body.databaseId);

    if(!database)
        return NextResponse.json({success: false, message: "Database not found."}, {status: 404});

    if(!user.admin && !user.databaseIDs.includes(database.id)) 
        return NextResponse.json({success: false, message: "Insufficient permissions."}, {status: 403});

    user.databaseIDs = user.databaseIDs.filter(id => id !== database.id);

    await SaveUser(user);

    await unlink("./data/databases/" + database.id + ".epdb");
    await unlink("./data/databasemetadata/" + database.id + ".json");

    await DeleteAccessTokensByDatabase(database.id);

    return NextResponse.json({success: true});
}