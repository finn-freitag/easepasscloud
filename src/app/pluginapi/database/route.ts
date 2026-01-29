import { CheckAccessToken, GetAccessToken } from "@/backend/helper/AccessTokenHelper";
import { GetDatabase, GetDatabaseStream, SaveDatabase, WriteDatabase } from "@/backend/helper/DatabaseHelper";
import { ReadStream } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    console.log("get /pluginapi/database");

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

    let webStream = GetDatabaseStream(accesstoken.databaseID);

    if(!webStream)
        return NextResponse.json({success:false, message:"Database file not found."}, {status:500});

    return new NextResponse(nodeToWebReadable(webStream), {
        headers: {
            'Content-Disposition': `attachment; filename="database.epdb"`,
            'Content-Type': 'application/octet-stream',
        },
    });
}

export async function POST(req: NextRequest){
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
    
    try {
        const arrayBuffer = await req.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await WriteDatabase(accesstoken.databaseID, buffer);

        database.lastModified = new Date();
        await SaveDatabase(database);
        
        return NextResponse.json({
            success: true, 
            message: "File uploaded successfully."
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({success:false, message:"Failed to process upload."}, {status:500});
    }
}

function nodeToWebReadable(nodeStream: ReadStream): ReadableStream {
    return new ReadableStream({
        start(controller) {
            nodeStream.on('data', (chunk:any) => {
                controller.enqueue(chunk);
            });
            nodeStream.on('end', () => {
                controller.close();
            });
            nodeStream.on('error', (err:any) => {
                controller.error(err);
            });
        },
        cancel(reason){
            
        }
    });
}