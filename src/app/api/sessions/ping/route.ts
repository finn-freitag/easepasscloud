import { CheckSessionToken } from "@/backend/helper/SessionHelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    let sessionToken = (await req.json()).sessionToken;

    if(!sessionToken)
        return NextResponse.json({success: false, message: "No session token provided."});

    return NextResponse.json({success: await CheckSessionToken(sessionToken), message: "Pong"});
}