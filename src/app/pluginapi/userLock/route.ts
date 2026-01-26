import { CheckAccessToken, GetAccessToken } from "@/backend/helper/AccessTokenHelper";
import { GetDatabase, SaveDatabase } from "@/backend/helper/DatabaseHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    let accesstokenStr = req.headers.get("accesstoken");
    let lockstatus = req.headers.get("lockstatus");
    if(!accesstokenStr || !lockstatus)
        return NextResponse.json({success:false, message:"No access token or lock status provided."}, {status:401});

    let accesstoken = await GetAccessToken(accesstokenStr);
    if(!accesstoken)
        return NextResponse.json({success:false, message:"Invalid access token."}, {status:401});

    if(!(await CheckAccessToken(accesstoken.token)))
        return NextResponse.json({success:false, message:"Access token does not have required permissions."}, {status:403});

    let database = await GetDatabase(accesstoken.databaseID);
    if(!database)
        return NextResponse.json({success:false, message:"Database for access token not found."}, {status:500});

    if(lockstatus === "lock"){
        database.locked = true;
        database.lastLocked = new Date();
    } else if(lockstatus === "unlock"){
        database.locked = false;
    }

    await SaveDatabase(database);

    return NextResponse.json({success:true, message:"Lock status updated successfully."});
}