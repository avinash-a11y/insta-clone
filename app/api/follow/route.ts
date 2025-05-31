import { User } from "@/mongoose/schema";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const { username, usernameToFollow } = await request.json();
    const user = await User.findOne({username: username});
    const userToFollow = await User.findOne({username: usernameToFollow});
    if(!user || !userToFollow){
        return NextResponse.json({message: "User not found"}, {status: 404});
    }
    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);
    await user.save();
    await userToFollow.save();
    return NextResponse.json({message: "Followed successfully"}, {status: 200});
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const usernameToFollow = searchParams.get('usernameToFollow');
    const user = await User.findOne({username: username});
    const userToFollow = await User.findOne({username: usernameToFollow});
    if(!user || !userToFollow){
        return NextResponse.json({message: "User not found"}, {status: 404});
    }
    const isFollowing = user.following.includes(userToFollow._id);
    return NextResponse.json({isFollowing}, {status: 200});
}   