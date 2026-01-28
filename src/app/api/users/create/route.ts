import { HashArgon2 } from "@/backend/helper/HashHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetAllUsers, GetUserByUsername, SaveAllUsers } from "@/backend/helper/UserHelpers";
import { User } from "@/backend/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    let body = await req.json();
    let sessionToken = body.sessionToken;
    let username = body.username;
    let password = body.password;
    let admin = body.admin;

    if(!sessionToken || !username || !password || admin == undefined)
        return NextResponse.json({success: false, message: "Missing parameters!"}, {status: 400});

    if(!(await CheckSessionToken(sessionToken)))
        return NextResponse.json({success: false, message: "Ivalid session token."}, {status: 401});

    let info = await GetSessionInfo(sessionToken);
    if(!info)
        return NextResponse.json({success: false, message: "Session token not found."}, {status: 404});

    let user = await GetUserByUsername(info.username);
    if(!user)
        return NextResponse.json({success: false, message: "User not found."}, {status: 404});

    if(!user.admin)
        return NextResponse.json({success: false, message: "Insufficient permissions."}, {status: 403});

    if(await GetUserByUsername(username))
        return NextResponse.json({success: false, message: "Username already taken."}, {status: 409});

    let newUser: User = {
        username: username,
        passwordHash: await HashArgon2(password),
        databaseIDs: [],
        accessTokens: [],
        admin: admin
    }

    let users = await GetAllUsers();
    users.push(newUser);
    await SaveAllUsers(users);

    return NextResponse.json({success: true, message: "User created successfully."});
}