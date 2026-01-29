import { getServerConfig } from "@/backend/helper/ServerConfigHelper";
import { NextResponse } from "next/server";

export async function GET(){
    let serverConfig = await getServerConfig();

    return NextResponse.json({imprint: serverConfig?.linkToImprint || null, privacyPolicy: serverConfig?.linkToPrivacyPolicy || null});
}