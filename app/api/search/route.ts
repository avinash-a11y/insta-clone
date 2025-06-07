import { NextResponse } from 'next/server';
import { User, Post } from '@/mongoose/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ 
        message: "Query parameter is required" 
      }, { status: 400 });
    }

    // Create a case-insensitive regex pattern for the search query
    const searchRegex = new RegExp(query, 'i');

    // Search for users by username
    const users = await User.find({ 
      username: searchRegex 
    }).select('username profilePicture');

    // Search for posts by caption
    const posts = await Post.find({ 
      caption: searchRegex 
    }).sort({ createdAt: -1 }).limit(20);

    return NextResponse.json({
      users,
      posts,
      success: true
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
} 