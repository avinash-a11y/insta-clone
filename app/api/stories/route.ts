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
    const { username , story } = await request.json();
    const added = await Story.create({ username , story });
    return NextResponse.json({
        message: "Story added successfully",
        story: added,
    });
}
