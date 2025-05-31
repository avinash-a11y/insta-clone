import { Post } from "@/mongoose/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const posts = await Post.find();
    return NextResponse.json({ posts });
}


export async function POST(request: Request) {
    const { username, image, caption } = await request.json();
    const post = await Post.create({ username, image, caption });
    return NextResponse.json({ post });
}

export async function PUT(request: Request) {
    const { id , username} = await request.json();
    console.log(id , username);
    const post = await Post.findById(id);
    if(!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if(post.likes.includes(username)) {
        post.likes = post.likes.filter((like: string) => like !== username);
    } else {
        post.likes.push(username);
    }
    await post.save();
    return NextResponse.json({ message: "Post updated successfully" });
}
