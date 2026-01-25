import { RemoveExpiredAccessTokens } from "@/backend/helper/AccessTokenHelper";
import { RemoveAllExpiredSessionTokens } from "@/backend/helper/SessionHelper";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest){
    RemoveAllExpiredSessionTokens();
    RemoveExpiredAccessTokens();
    return NextResponse.json({success: true});
}