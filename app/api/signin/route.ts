import { User } from "@/mongoose/schema";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const { username, password } = await request.json();
    const user = await User.findOne({ username, password });
    if(!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User found" });
}