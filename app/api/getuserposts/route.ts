import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/mongoose/schema";

export async function GET(request: NextRequest) {
    const username = request.nextUrl.searchParams.get("username");
    if(!username){
        return NextResponse.json({error: "Username is required"}, {status: 400});
    }
    const posts = await Post.find({username: username});
    return NextResponse.json(posts);
}