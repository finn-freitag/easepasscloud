import { InvalidateSessionToken } from "@/backend/helper/SessionHelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    let body = await req.json();
    let sessionToken = body.sessionToken;
    InvalidateSessionToken(sessionToken);

    return NextResponse.json({ success: true });
}