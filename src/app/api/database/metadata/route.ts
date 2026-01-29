import { GetDatabase, SaveDatabase } from "@/backend/helper/DatabaseHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername } from "@/backend/helper/UserHelpers";
import { Database } from "@/backend/models/Database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    console.log("post /api/database/metadata");

    let body = (await req.json()) as {database: Database, sessionToken: string};
    
    if(!(await CheckSessionToken(body.sessionToken)))
        return NextResponse.json({success: false, message: "Invalid session token."}, {status: 401});

    let sessionInfo = await GetSessionInfo(body.sessionToken);
    if(!sessionInfo)
        return NextResponse.json({success: false, message: "Session not found."}, {status: 404});

    let user = await GetUserByUsername(sessionInfo.username);

    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    if(user.databaseIDs.includes(body.database.id) === false && !user.admin)
        return NextResponse.json({success: false, message: "User does not have access to this database."}, {status: 403});

    let existing = await GetDatabase(body.database.id);
    if(!existing)
        return NextResponse.json({success: false, message: "Database not found."}, {status: 404});
    
    await SaveDatabase(body.database);

    return NextResponse.json({success: true}, {status: 200});
}