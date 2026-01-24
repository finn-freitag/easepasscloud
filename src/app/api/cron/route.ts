import { RemoveAllExpiredSessionTokens } from "@/backend/helper/SessionHelper";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest){
    RemoveAllExpiredSessionTokens();
    return NextResponse.json({success: true});
}