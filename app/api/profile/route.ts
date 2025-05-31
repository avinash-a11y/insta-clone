import { NextRequest, NextResponse } from "next/server";
import { User } from "@/mongoose/schema";
export async function GET(request: NextRequest) {
    const username = request.nextUrl.searchParams.get("username");
    if(!username){
        return NextResponse.json({error: "Username is required"}, {status: 400});
    }
    const user = await User.findOne({username: username});
    if(!user){
        return NextResponse.json({error: "User not found"}, {status: 404});
    }
    return NextResponse.json(user);
}

