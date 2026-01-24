import { CreateSessionToken } from "@/backend/helper/SessionHelper";
import { LoginUser } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let body: {
        username: string;
        password: string;
    } = await req.json();

    let user = await LoginUser(body.username, body.password);

    if(user) {
        let sessionToken = await CreateSessionToken(user.username);
        return NextResponse.json({ success: true, user: {...user, passwordHash: undefined}, sessionToken: sessionToken });
    }
    else
        return NextResponse.json({ success: false }, { status: 401 });
}