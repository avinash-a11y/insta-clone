import { NextRequest, NextResponse } from "next/server";
import { User } from "@/mongoose/schema";

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();
  try {
    const user = await User.create({ username, email, password });
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "User creation failed" }, { status: 500 });
  }
}
