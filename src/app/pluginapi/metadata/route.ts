import { CheckAccessToken, GetAccessToken } from "@/backend/helper/AccessTokenHelper";
import { GetDatabase } from "@/backend/helper/DatabaseHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    console.log("get /pluginapi/metadata");

    let accesstokenStr = req.headers.get("accesstoken");
    if(!accesstokenStr)
        return NextResponse.json({success:false, message:"No access token provided."}, {status:401});

    let accesstoken = await GetAccessToken(accesstokenStr);
    if(!accesstoken)
        return NextResponse.json({success:false, message:"Invalid access token."}, {status:401});

    if(!(await CheckAccessToken(accesstoken.token)))
        return NextResponse.json({success:false, message:"Access token does not have required permissions."}, {status:403});

    let database = await GetDatabase(accesstoken.databaseID);
    if(!database)
        return NextResponse.json({success:false, message:"Database for access token not found."}, {status:500});

    return NextResponse.json({success:true, data: {
        LastModified: database.lastModified,
        DatabaseName: database.name,
        DatabaseID: database.id,
        Locked: database.locked,
        Readonly: accesstoken.readonly
    }});
}