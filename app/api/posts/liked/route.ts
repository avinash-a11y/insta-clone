import { NextResponse } from 'next/server';
import { Post } from '@/mongoose/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ 
        message: "Username parameter is required" 
      }, { status: 400 });
    }

    // Find posts where the username is in the likes array
    const likedPosts = await Post.find({ 
      likes: { $in: [username] } 
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      likedPosts,
      success: true
    });
  } catch (error: any) {
    console.error('Liked posts fetch error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
} 