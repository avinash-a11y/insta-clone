import { Post } from "@/mongoose/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const posts = await Post.find();
    return NextResponse.json({ posts });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const caption = formData.get('caption') as string;
        const imageFile = formData.get('image') as File;
        
        if (!imageFile || !username) {
            return NextResponse.json(
                { error: "Image and username are required" },
                { status: 400 }
            );
        }

        // Read the file as ArrayBuffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert to base64 for storage
        // In a production environment, you'd likely upload this to a cloud storage service
        const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        
        const post = await Post.create({
            username,
            caption,
            image: base64Image
        });
        
        return NextResponse.json({ 
            post,
            success: true 
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
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
