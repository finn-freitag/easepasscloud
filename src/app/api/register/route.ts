import { getDefaultValues } from "@/backend/DefaultValues";
import { getServerConfig } from "@/backend/helper/ServerConfigHelper";
import { CreateSessionToken } from "@/backend/helper/SessionHelper";
import { RegisterUser } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    console.log("post /api/register");

    let serverconfig = await getServerConfig();
    if(!serverconfig.publicInstance)
        return NextResponse.json({ success: false, message: "Instance is not public." }, { status: 403 });
    
    let body = await req.json();

    if(!body.username || !body.password || body.username.length === 0 || body.password.length === 0)
        return NextResponse.json({ success: false, message: "Missing parameters." }, { status: 400 });

    let user = await RegisterUser(body.username, body.password);
    if(!user)
        return NextResponse.json({ success: false, message: "Username already exists." }, { status: 409 });

    let sessionToken = await CreateSessionToken(user.username);
    return NextResponse.json({ success: true, user: {...user, passwordHash: undefined}, sessionToken: sessionToken, defaultValues: getDefaultValues() });
}