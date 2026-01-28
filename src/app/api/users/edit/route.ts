import { HashArgon2 } from "@/backend/helper/HashHelper";
import { CheckSessionToken, GetSessionInfo } from "@/backend/helper/SessionHelper";
import { GetAllUsers, GetUserByUsername, SaveAllUsers } from "@/backend/helper/UserHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json();
    const {sessionToken, username, newUsername, password, admin} = body;

    if(!sessionToken || !username)
        return new Response(JSON.stringify({success: false, message: "Missing parameters."}), {status: 400});

    if((newUsername && newUsername.length === 0) || (password && password.length === 0))
        return new Response(JSON.stringify({success: false, message: "Missing parameters."}), {status: 400});

    if(!(await CheckSessionToken(sessionToken)))
        return new Response(JSON.stringify({success: false, message: "Invalid session token."}), {status: 401});

    let info = await GetSessionInfo(sessionToken);
    if(!info)
        return new Response(JSON.stringify({success: false, message: "Failed to retrieve session info."}), {status: 500});

    let user = await GetUserByUsername(info.username);
    if(!user)
        return new Response(JSON.stringify({success: false, message: "User not found."}), {status: 404});

    if(!user.admin)
        return new Response(JSON.stringify({success: false, message: "Insufficient permissions."}), {status: 403});

    let editUser = await GetUserByUsername(username);
    if(!editUser)
        return new Response(JSON.stringify({success: false, message: "User to edit not found."}), {status: 404});

    console.log("Editing user:", username, "to", newUsername);
    if(newUsername && await GetUserByUsername(newUsername))
        return new Response(JSON.stringify({success: false, message: "New username is already taken."}), {status: 400});

    let users = await GetAllUsers();
    for(let i = 0; i < users.length; i++){
        if(users[i].username === username){
            users[i] = {
                ...users[i],
                username: newUsername ?? users[i].username,
                passwordHash: password ? await HashArgon2(password) : users[i].passwordHash,
                admin: typeof admin === "boolean" ? admin : users[i].admin
            };
        }
    }
    await SaveAllUsers(users);

    return NextResponse.json({success: true, message: "User edited successfully."});
}