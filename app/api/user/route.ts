import { NextResponse } from "next/server";
import {User} from "../../../mongoose/schema";

export async function POST(request: Request) {
  const { email, password, username } = await request.json();
  const user = await User.create({ email, password, username });
  return NextResponse.json({ message: "User created successfully" });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const user = await User.findOne({ username });
    return NextResponse.json(user);
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const user = await User.findOne({ username });
    user.followers.push(username);
    await user.save();
    return NextResponse.json({ message: "User followed successfully" });
}