import { Post } from "@/mongoose/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { postId, username, text } = await request.json();
    
    if (!postId || !username || !text) {
      return NextResponse.json(
        { error: "Post ID, username, and comment text are required" },
        { status: 400 }
      );
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    

    
    post.comments.push(text);
    await post.save();
    
    return NextResponse.json({ 
      message: "Comment added successfully",
      comment: text
    }, {status: 200});
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
} 