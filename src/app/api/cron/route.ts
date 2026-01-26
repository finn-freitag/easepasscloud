import { RemoveExpiredAccessTokens } from "@/backend/helper/AccessTokenHelper";
import { AutoUnlockAll } from "@/backend/helper/DatabaseHelper";
import { RemoveAllExpiredSessionTokens } from "@/backend/helper/SessionHelper";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest){
    RemoveAllExpiredSessionTokens();
    RemoveExpiredAccessTokens();
    AutoUnlockAll();
    return NextResponse.json({success: true});
}