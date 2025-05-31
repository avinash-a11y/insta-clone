import { Metadata } from "next";
import Stories from "@/components/stories";
import Posts from "@/components/posts";

export const metadata: Metadata = {
  title: "Home | Instagram Clone",
  description: "View and share photos with your friends",
};

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store"
  });
  const data = await response.json();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="max-w-xl mx-auto">
        <Stories />
        <Posts posts={data.posts} />
      </div>
    </div>
  );
}