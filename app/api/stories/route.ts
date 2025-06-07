import { NextResponse } from 'next/server';
import { User, Story } from '../../../mongoose/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = await User.findOne({ username });
    const Following = user?.following;
    const stories = await Story.find({ username: { $in: Following } });
    const userStories = await Story.find({ username });
    const allStories = [...userStories , ...stories];


    return NextResponse.json({
        following: Following,
        username: username,
        stories: allStories,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const storyFile = formData.get('story') as File;
        
        if (!storyFile || !username) {
            return NextResponse.json(
                { error: "Image and username are required" },
                { status: 400 }
            );
        }

        // Read the file as ArrayBuffer
        const bytes = await storyFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert to base64 for storage
        // In a production environment, you'd likely upload this to a cloud storage service
        const base64Image = `data:${storyFile.type};base64,${buffer.toString('base64')}`;
        
        const added = await Story.create({
            username,
            story: base64Image
        });
        
        return NextResponse.json({
            message: "Story added successfully",
            story: added,
            success: true
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error creating story:', error);
        return NextResponse.json(
            { error: "Failed to create story" },
            { status: 500 }
        );
    }
}
