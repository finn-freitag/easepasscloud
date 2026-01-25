import { HashArgon2, VerifyArgon2 } from "@/backend/helper/HashHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetUserByUsername, SaveUser } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let { oldPassword, newPassword, sessionToken, username } = await req.json();

    if(!oldPassword || !newPassword || !sessionToken || !username)
        return NextResponse.json({ success: false, message: "Missing parameters." }, { status: 400 });

    if(!(await CheckSessionToken(sessionToken)))
        return NextResponse.json({ success: false, message: "Invalid session token." }, { status: 401 });

    let info = await GetSessionInfo(sessionToken);
    if(!info)
        return NextResponse.json({ success: false, message: "Session not found." }, { status: 401 });

    let user = await GetUserByUsername(username);
    if(!user)
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    if(info.username !== username && !user.admin)
        return NextResponse.json({ success: false, message: "You do not have permission to change this password." }, { status: 403 });

    if(!user.admin && !VerifyArgon2(user.passwordHash, oldPassword))
        return NextResponse.json({ success: false, message: "Old password is incorrect." }, { status: 403 });

    user.passwordHash = await HashArgon2(newPassword);

    await SaveUser(user);

    return NextResponse.json({ success: true });
}